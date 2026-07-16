import { defineNuxtModule, installModule } from '@nuxt/kit';
import UIOverlayModule from '@wbsoft/ui-overlay';
import UIGuideLayoutModule from '@wbsoft/ui-layout';

export default defineNuxtModule({
    meta: {
        name: 'overlay-bridge',
    },
    async setup(resolvedOptions, nuxt) {
        // 메인 앱 오버레이용 공통 컴포넌트 패키지 설치
        await installModule(UIOverlayModule, {
            defaultVersion: 'V1',
        })

        // 도메인 레이어별 레이아웃 공통 컴포넌트 패키지 설치
        // - 가이드 문서 레이어 공통 모듈 브릿지 연동
        await installModule(UIGuideLayoutModule, {
            defaultVersion: 'V1',
        })
    },
});