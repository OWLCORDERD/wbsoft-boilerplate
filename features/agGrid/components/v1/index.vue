<template>
    <!-- 서버사이드 hydration 오류 방지를 위한 클라이언트 사이드 렌더링 처리 -->
    <ClientOnly>
        <Suspense>
            <template #default>
                <component :is="AgGridCtor" :gridId="gridId" :options="gridOptions" @getGrid="emit('getGrid', $event)" />
            </template>

            <template #fallback>
                <div class="skeleton-grid">Loading...</div>
            </template>
        </Suspense>
    </ClientOnly>
</template>
<script setup lang="ts">
import type { createAgGridOptionType } from 'agGrid';

const props = defineProps({
    // * 고유 그리드 식별 아이디 (필수 값)
    // 아이디가 없는 경우 노데이터 테이블 노출 처리 
    gridId: {
        type: String,
        required: true,
        default: () => 'ag-grid-default',
    },
    // 부모 상속 그리드 옵션
    options: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const AgGridCtor = defineAsyncComponent(() => import('./Ctor.vue'));

const emit = defineEmits(['getGrid']);

const gridOptions: ComputedRef<createAgGridOptionType> = computed(() => {
    if (props.options) {
        return props.options as createAgGridOptionType;
    }

    return {
        rowData: [],
        colDefs: []
    }
})
</script>
<style lang="scss">
    .grid-container {
        width: 650px;
        height: 400px;
    }
</style>