<template>
  <div class="grid-container">
    <div ref="editor" :id="gridId" style="width: 100%; height: 100%;" v-if="gridId !== 'ag-grid-default'" />

    <div class="no-data-grid" v-else>
      <div class="no-data-grid-content">
        그리드가 없어요
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { agGridEditorInstance } from '~/features/lxp/composables/agGrid';
import type { createAgGridOptionType } from 'ag-grid';

const props = defineProps({
    gridId: {
        type: String,
        required: true,
        default: () => 'ag-grid-default',
    },
    options: {
        type: Object as PropType<createAgGridOptionType>,
        required: true,
        default: () => ({})
    }
})

const emit = defineEmits(['getGrid']);

const editor = ref();

onMounted(() => {
    const el = document.getElementById(props.gridId) as HTMLDivElement;

    if (!el) return;

    const grid = agGridEditorInstance(el, props.options);

    emit('getGrid', grid);
})
</script>

<style lang="scss" scoped>

</style>