import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: '@wbsoft/ui-overlay',
        configKey: 'uiOverlay'
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // 1. @Nuxt/kit 모듈을 통한 버전별 컴포넌트 auto-import 처리 (버전별 접두사 부여)
        nuxt.hook('components:dirs', (dirs) => {
            dirs.push({
                path: resolver.resolve('./v1/components'),
                prefix: 'V1', // ex) alert -> V1Alert
                global: true,
            })

            dirs.push({
                path: resolver.resolve('./v2/components'),
                prefix: 'V2', // ex) alert -> V2Alert
                global: true,
            })
        })

        // 2. @Nuxt/kit 모듈을 통한 버전별 Composable auto-import 처리
        addImportsDir(resolver.resolve('./v1/composables'))
        addImportsDir(resolver.resolve('./v2/composables'))
    }
})