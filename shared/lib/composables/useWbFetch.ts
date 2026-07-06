import { useSession } from 'h3';

// 클라이언트 컴포넌트단 경로 이동 시, 토큰 캐시 컬렉션
const CACHE_COLLECTION = new Map();
const CACHE_REFRESH_TIME = 1000 * 60 * 60; // 1시간마다 캐시 초기화

const setCacheToken = (path: string, token: string) => {
  const now = Date.now();
  const refreshTime = now + CACHE_REFRESH_TIME;
  CACHE_COLLECTION.set(path, { token, refreshTime });
}

const getCacheToken = (path) => {
  const cache = CACHE_COLLECTION.get(path);
  if (!cache) return null;

  const now = Date.now();

  if (cache.refreshTime >= now) {
    return cache.token;
  } else {
    CACHE_COLLECTION.delete(path);
    return null;
  }
}

// 2026.01.31 [mhlim]: 로그아웃 중복 호출 방지 플래그
let isLoggingOut = false;

export const useWbFetch = async (url, options) => {
  const config = useRuntimeConfig();
  const i18n = useNuxtApp().$i18n;
  const _url = useRequestURL();
  const $auth = useNuxtApp().$auth;
  const route = useRoute();

  switch (options.baseURL) {
    case 'lxp':
      options.baseURL = config.public.baseURL;
      break;
    // 교육 메인 프로젝트 API 도메인
    case 'education':
      options.baseURL = config.public.educationBaseURL;
      break;
    // 교수성과평가시스템 API 도메인
    case 'evaluation':
      options.baseURL = config.public.evaluationBaseURL;
      break;
    case 'material':
      options.baseURL = config.public.materialBaseURL;
      break;
    case 'auth':
      options.baseURL = config.public.authBaseURL;
      break;
  }

  const headers = useRequestHeaders([
    'cookie',
    'user-agent',
    'x-forwarded-for',
  ]);

  headers.h_host = _url.host === 'localhost:3000' ? 'kteds.wbsoft.kr' : _url.host;
  headers.h_hostname = _url.hostname === 'localhost' ? 'kteds.wbsoft.kr' : _url.hostname;
  headers.h_locale = i18n.locale.value;
  headers.h_device_type = deviceType.value;

  options.headers = { ...options.headers, ...headers };

  options.credentials = 'include'

  // true면 403·AUTH_INVALID_CREDENTIALS 전역 모달 생략 → 호출부 try/catch 등에서 처리
  const skipGlobalErrorModal = options.skipGlobalErrorModal === true;
  if ('skipGlobalErrorModal' in options) {
    delete options.skipGlobalErrorModal;
  }

  // 사용자가 전달한 onResponse 콜백을 저장
  const userOnResponse = options.onResponse;
  const userOnResponseError = options.onResponseError;

  options.onResponse = ({ response, request, options }) => {
    // 2026.01.26[mhlim]: 204, 201 body 파싱 오류 발생 시 정상 응답 처리
    if (response.status === 204 || response.status === 201) {
      // body가 없는 경우 JSON 파싱 처리 오류 방지
      // 응답 데이터 구조 예외처리
      response._data = {
        success: true, // 응답 성공 여부
        status: response.status, // 응답 상태 코드
        data: response._data?.data || null, // 정상 파싱된 데이터 예외 처리
      };
    }

    // 클라이언트 요청단에서 onResponse 콜백 존재 시, 호출
    if (userOnResponse) {
      userOnResponse({ response, request, options });
    }
  };

  options.onResponseError = ({ response, request, options }) => {
    if (isLoggingOut) {
      return;
    }
    // 로그인 인증 에러 상태 코드 관리
    if (response.status === 401) {
      // 응답 데이터 필드 조회
      const _data = response._data;
      // 오류 코드 조회
      const code = _data.errorCode;

      // 2026.01.27 [mhlim]: 로그인 인증 에러 상태에 따른 컨펌 모달 출력

      // 아이디 또는 비밀번호 불일치
      if (!skipGlobalErrorModal && code === 'AUTH_INVALID_CREDENTIALS') {
        useConfirm().show({
          message: _data.message ? _data.message : '아이디 또는 비밀번호가 올바르지 않습니다.',
          confirm: '확인',
          hasCancel: false,
        })
        return;
      }

      
      // 2026.01.31 [mhlim]: 게이트가 아닌 플랫폼 페이지에서 API 인증 에러 응답 받은 경우
      if (
        _data.error === 'Unauthorized'
        && route.path !== '/platform-gate'
        && !route.path.startsWith('/kiosk')
        && !route.path.startsWith('/user')
        && !route.path.includes('/course-material')
      ) {
        // 중복 로그아웃 무한루프 방지
        if (!isLoggingOut && $auth) {
          isLoggingOut = true;
          // 로그아웃 처리
          $auth.logout('/platform-gate').finally(() => {
            // 로그아웃 완료 후 플래그 리셋
            nextTick(() => {
              isLoggingOut = false
            });
          });
        }
        return;
      }
    }

    // 403 권한 없음
    if (response.status === 403) {
      if (!skipGlobalErrorModal) {
        useConfirm().show({
          message: response._data?.message || '접근 권한이 없습니다.',
          confirm: '확인',
          hasCancel: false,
        });
        return;
      }
    }

    // 2026.01.27 [mhlim]: 클라이언트 요청단 onResponseError 콜백 호출 처리
    if (userOnResponseError) {
      userOnResponseError({ response, request, options });
    }
  };

  if (import.meta.server) {
    // SSR: h3 세션에서 토큰을 가져와서 Authorization 헤더에 추가
    try {
      const event = useRequestEvent();
      if (event) {
        const session = await useSession(event, {
          password: config.sessionPassword,
          cookie: {
            secure: config.public.env === 'production',
            httpOnly: true,
          }
        });

        // 세션에 토큰이 있으면 Authorization 헤더에 추가
        if (session.data?.token?.at) {
          const tokenType = session.data.token.tokenType || 'Bearer';
          options.headers = {
            ...options.headers,
            Authorization: `${tokenType} ${session.data.token.at}`
          };
        }
      }
    } catch (e) {
      // 세션 읽기 실패 시 토큰 없이 진행 (비로그인 상태 또는 공개 API)
      console.warn('[useWbFetch] SSR session read failed:', e.message);
    }

    return $fetch(url, options);
  }

  if ($auth && $auth.isLogin && !$auth.isLogin.value) {
    return $fetch(url, options);
  }

  // 2026.01.27 [mhlim]: 토큰 유효성 검사 완료된 경로의 캐시 토큰 사용
  const cacheToken = getCacheToken(route.path);
  if (cacheToken) {
    options.headers.Authorization = `Bearer ${cacheToken}`;
    return $fetch(url, options);
  }

  // 2026.01.27 [mhlim]: 캐시 토큰이 없는 경우 > 토큰 유효성 검사 요청
  if (!cacheToken) {
    const validateCheck = await $fetch('/api/auth/session', {
      method: 'GET',
      query: {
        mode: 'validate',
      }
    })

    // alert(JSON.stringify(validateCheck));

    if (validateCheck.code === 'response.ok') {
      setCacheToken(route.path, validateCheck.data.at);
      options.headers.Authorization = `${validateCheck.data.tokenType} ${validateCheck.data.at}`;
      return $fetch(url, options);
    } else {
      if (validateCheck.code === 'session.fail'
        || validateCheck.code === 'token.invalid'
        || validateCheck.code === 'token.refresh.fail'
        || validateCheck.code === 'response.invalid'
      ) {
        // 토큰 검증 실패 시 해당 경로의 캐시 제거
        CACHE_COLLECTION.delete(route.path);
        await $auth.logout('/platform-gate');
      }
      return;
    }
  }
};