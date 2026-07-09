import { defineNuxtModule, installModule } from '@nuxt/kit';
import UIOverlayModule from '@wbsoft/ui-overlay';

export default defineNuxtModule({
    meta: {
        name: 'overlay-bridge',
    },
    async setup(resolvedOptions, nuxt) {
        await installModule(UIOverlayModule, {
            defaultVersion: 'V1',
        })
    },
});