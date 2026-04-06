// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  // 2024.09.08: SCSS 스타일 변수 속성 import 없이 전역 사용 설정
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "assets/common/styles/_variables.scss" as *;',
        },
      },
    },
  },
  // 2024.09.08: 전역에 공통으로 적용할 css 설정
  css: ["assets/common/styles/layout.scss"],
});
