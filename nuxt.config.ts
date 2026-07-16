import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-06',
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
    dirs: ['~/shared/lib/composables/*.ts'],
  },
  // 2024.09.08: SCSS 스타일 전역 변수 속성 최상단 주입
  vite: {
    css: {
      preprocessorOptions: {
      scss: {
          additionalData: '@use "@/assets/common/styles/base/main.scss" as *;',
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
  },
  // 2024.09.08: 전역 공통 css 설정
  // main.scss는 additionalData 전용 (mixin/변수 주입) → 중복 로드 방지를 위해 global.scss 분리 사용
  css: [
    '@/assets/common/styles/base/global.scss',
  ],
  // 2026.07.06: Nuxt 4 레이어 구조 활성화 처리
  future: {
    compatibilityVersion: 4,
  },
  extends: [
    'wb-ui-layout',
    'wb-ui-overlay',
  ],
  modules: ['./modules/overlay-bridge', 'nuxt-font-loader', 'nuxt-svgo'],
  fontLoader: {
    local: [
      {
        src: '@/assets/common/fonts/Paperlogy-4Regular.ttf',
        family: 'Paperlogy_R',
        weight: 400,
        style: 'normal',
        display: 'swap'
      },
      {
        src: '@/assets/common/fonts/Paperlogy-5Medium.ttf',
        family: 'Paperlogy_M',
        weight: 500,
        style: 'normal',
        display: 'swap'
      },
      {
        src: '@/assets/common/fonts/Paperlogy-7Bold.ttf',
        family: 'Paperlogy_B',
        weight: 700,
        style: 'normal',
        display: 'swap'
      },
    ],
  },
  // // 2026.07.13 [mhlim]: 외부 패키지 컴포넌트 등록
  // components: [
  //   // 도메인 레이어별 레이아웃 (wb-ui-layout) 컴포넌트 조각 등록
  //   {
  //     path: join(require.resolve('@wbsoft/ui-layout/package.json'), '../src'),
  //     pathPrefix: false,
  //     global: true,
  //   }
  // ],
  // nuxt-svgo 컴포넌트 autoImport 경로 설정
  svgo: {
    autoImportPath: '@/assets/lxp/images/svg',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NITRO_API_BASE_URL,
      filebaseApiKey: process.env.FILEBASE_API_KEY,
      filebaseProjectId: process.env.FILEBASE_PROJECT_ID,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      agGridLicenseKey: process.env.AG_GRID_LICENSE_KEY,
    },
  },
});
