// 2026.07.10 [mhlim]: auto-import 컴포넌트 외에 명시적으로 라이브러리 import 필요 시 사용
import { defineNuxtModule, createResolver, addImportsDir } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default defineNuxtModule({
    meta: {
        name: 'wb-ui-layout',
        configKey: 'wbUiLayout',
    },
    setup(options, nuxt) {
        nuxt.hook('components:dirs', (dirs) => {
            // 관리자(LXP) 레이어 공통 컴포넌트 접두사 등록
            dirs.push({
                path: resolver.resolve('./lxp'),
                prefix: 'LXP',
                global: true,
            });

            // 가이드 문서 레이어 공통 컴포넌트 접두사 등록
            dirs.push({
                path: resolver.resolve('./docs'),
                prefix: 'DOCS',
                global: true,
            });

            // 관리자(LXP) 레이어 공통 Composable 등록
            addImportsDir(resolver.resolve('./lxp/composables'));
            // 가이드 문서 레이어 공통 Composable 등록
            addImportsDir(resolver.resolve('./docs/composables'));
        });
    },
})