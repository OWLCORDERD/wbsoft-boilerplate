// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-06",
  devtools: { enabled: true },
  /// 빌드 시점 생성되는 .output 산출물은 node로 실행되어 서버 소스맵 사용 x -> 빌드 시간 단축
  sourcemap: {
    server: false,
    client: false,
  },
  app: {
    head: {
      titleTemplate: 'Wbsoft Boilerplate',
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [
        {
          name: 'referrer',
          content: 'origin',
        },
        {
          name: 'Strict-Transport-Security',
          content: 'max-age=31536000',
        },
      ],
    },
  },
  // 2026.01.15 [mhlim]: 서버사이드 uuid v4 모듈 import 오류 발생
  // -> node 내장 모듈 crypto를 통한 uuid 생성 유틸리티로 대체
  alias: {
    uuid: '@/utils/uuid',
  },
  // 2026.07.06: 전역적으로 사용되는 컴포져블 모듈 디렉토리 autoImport 셋팅
  imports: {
    // index.d.ts 파일 제외 실제 컴포져블 파일만 지정
    dirs: [
      'shared/lib/composables/*.ts'
    ]
  },
  // 2024.09.08: SCSS 스타일 변수 속성 import 없이 전역 사용
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "assets/common/styles/_variables.scss" as *;',
        },
      },
    },
  },
  // 2024.09.08: 전역 공통 css 설정
  css: ["assets/common/styles/layout.scss"],
  // 2026.07.06: Nuxt 4 레이어 구조 활성화 처리
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      filebaseApiKey: process.env.FILEBASE_API_KEY,
      filebaseProjectId: process.env.FILEBASE_PROJECT_ID,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      agGridLicenseKey: process.env.AG_GRID_LICENSE_KEY,
    }
  },
});
