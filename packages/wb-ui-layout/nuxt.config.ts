import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },
    components: [
        // 2026.07.10 [mhlim]: 스캔 진행할 컴포넌트 조각들이 모여있는 경로 (/lxp, /user)
        {
            path: fileURLToPath(new URL('./src', import.meta.url)),
            pathPrefix: false,
        }
    ]
})