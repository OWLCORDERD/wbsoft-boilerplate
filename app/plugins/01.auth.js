// import { useMySessionStore } from "@/stores/session";

// // 2026.06.12 [송성욱]: 로그아웃 재진입 가드.
// // useWbFetch validate 실패 → logout() → 내부 /logout 호출이 다시 validate 실패 →
// // logout() 재호출로 이어지던 무한 재귀(mode=validate 폭주)의 최종 차단선.
// let isLogoutInProgress = false;

// export default defineNuxtPlugin(async (NuxtApp) => {
//   const sessionStore = useMySessionStore();
//   const nuxtApp = useNuxtApp();

//   const session = computed(() => {
//     return sessionStore.isLogin ? sessionStore.userInfo : null;
//   });

//   const isLogin = computed(() => {
//     return !!sessionStore.isLogin;
//   });

//   const roleId = computed(() => {
//     return sessionStore.getRoleId ?? null;
//   });

//   const setSession = async (data) => {
//     return await $fetch('/api/auth/session', {
//       method: 'POST',
//       body: data,
//     });
//   };

//   const getSession = async () => {
//     try {
//       const response = await $fetch('/api/auth/session', {
//         query: {
//           mode: 'init',
//         },
//       });
      
//       if (response.code === 'response.ok') {
//         sessionStore.setUserInfo(response.data);
//         return true;
//       } else {
//         if (response.code === 'session.fail' || response.code === 'token.invalid') {
//           sessionStore.setSessionExpired();
//         }
//         return false;
//       }
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   };

//   const login = async (user) => {
//     await setSession(user);
//     await getSession();
//   };

//   const logout = async (redirectUrl) => {
//     if (isLogoutInProgress) return;
//     isLogoutInProgress = true;

//     // 2026.01.29[mhlim]: 헤더 토큰 정보를 포함한 로그아웃 API 요청 처리
//     // 2026.06.12 [송성욱]: best-effort로 변경 — 세션이 이미 만료/초기화된 상태면 실패할 수
//     // 있으나, 그 경우에도 로컬 로그아웃(상태 초기화 + 리다이렉트)은 반드시 진행되어야 한다.
//     // skipTokenCheck: 내부에서 validate를 다시 타지 않도록 차단 (재귀 방지 핵심).
//     let backendLogoutOk = false;
//     try {
//       const response = await useWbFetch('/logout', {
//         baseURL: 'auth',
//         method: 'POST',
//         skipTokenCheck: true,
//         skipGlobalErrorModal: true,
//       });
//       backendLogoutOk = response?.success === true;
//     } catch (e) {
//       console.warn('[auth] 백엔드 로그아웃 실패(로컬 로그아웃은 계속 진행):', e?.message || e);
//     }

//     try {
//       // 클라이언트단 로그인 사용자 상태관리 초기화
//       sessionStore.setSessionExpired();

//       // h3 세션 > 토큰 정보 저장 초기화
//       await $fetch('/api/auth/session', {
//         method: 'POST',
//       })
//     } catch (e) {
//       console.warn('[auth] h3 세션 초기화 실패:', e?.message || e);
//     }

//     // 정상 로그아웃(백엔드 성공)과 세션 만료로 인한 강제 로그아웃을 구분해 안내
//     useToast().show(backendLogoutOk ? '로그아웃 되었습니다.' : '세션이 만료되어 로그아웃 됩니다.');

//     // 2026.02.10[ygpark]: 로그아웃 시 리다이렉트 처리방식 변경(뒤로가기 방지)
//     // (navigateTo+reload > window.location.replace)
//     if (import.meta.client && typeof window !== 'undefined') {
//       window.location.replace(redirectUrl);
//     }

//     // 가드 해제는 지연으로 처리: replace가 막힌 환경(샌드박스 iframe/팝업 등)에서 즉시
//     // 해제하면 후속 401들이 logout을 연쇄 재호출할 수 있다. 정상 케이스는 전체 리로드로
//     // 여기 도달 전 페이지가 사라지고, 막힌 경우에도 5초에 1회로 재시도가 제한된다.
//     setTimeout(() => {
//       isLogoutInProgress = false;
//     }, 5000);
//   };

//     // 2026.01.26[mhlim]: 앱 시작 시 세션 확인 및 복원
//   // 클라이언트에서만 실행 (서버사이드는 쿠키로 인증)
//   if (import.meta.client) {
//     // persist로 복원된 isLogin이 true인 경우, 서버 세션 유효성 확인
//     if (sessionStore.isLogin) {
//       await getSession();
//     }
//   }

//   return {
//     provide: {
//       auth: {
//         session,
//         setSession,
//         getSession,
//         isLogin,
//         roleId,
//         login,
//         logout,
//       },
//     },
//   };
// });
