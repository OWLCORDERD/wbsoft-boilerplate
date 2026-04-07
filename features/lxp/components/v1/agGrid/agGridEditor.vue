<template>
    <div class="grid-container">
        <div ref="editor" :id="gridId" style="width: 100%; height: 100%;"/>
    </div>
</template>
<script setup lang="ts">
import type { createAgGridOptionType } from 'ag-grid';
import { agGridEditorInstance } from '~/features/lxp/composables/agGrid';

    const props = defineProps({
        gridId: {
            type: String,
            required: true,
            default: () => `ag-grid-${new Date().toLocaleString('ko-KR').replace(/[^a-zA-Z0-9]/g, '')}`
        },
        options: {
            type: Object,
            required: true,
            default: () => ({})
        }
    })

    const emit = defineEmits(['getGrid']);

    const editor = ref();

    const gridOptions: ComputedRef<createAgGridOptionType> = computed(() => {
        if (props.options) {
            return props.options as createAgGridOptionType;
        }

        return {
            rowData: [],
            colDefs: []
        }
    })

    onMounted(() => {
        const el = document.getElementById(props.gridId) as HTMLDivElement;

        if (!el) return;

        const grid = agGridEditorInstance(el, gridOptions.value);

        emit('getGrid', grid);
    })
</script>
<style lang="scss">
    .grid-container {
        width: 650px;
        height: 400px;
    }
</style>