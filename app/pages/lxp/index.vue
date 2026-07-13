<template>
    <div id="wrapper-inner">
        <section>
            <AgGridV1
                :gridId="'example-grid'"
                :options="gridOptions"
                @getGrid="getGrid"
            />
        </section>
    </div>
</template>
<script setup lang="ts">
import { AgGridV1 } from '@/features/agGrid';
const grid = ref();

const gridOptions = reactive({
    rowData: [
        { name: '2026', company: '네이버', course: '네이버 웍스', version: '1.0.0' },
        { name: '2026', company: '네이버', course: '네이버 웍스', version: '1.0.0' }
    ],
    columnDefs: [
        { headerName: '년도', field: 'year' },
        { headerName: '회사', field: 'company' },
        { headerName: '과정', field: 'course' },
        { headerName: '버전', field: 'version' },

    ],
    pagination: false,
    rowHeaders: true,
    getRowHeight: () => 25,
})

const getGrid = (_grid: any) => {
    grid.value = _grid;

    console.log(grid.value);
}

definePageMeta({
    layout: 'lxp'
});
</script>
<style lang="scss">
    #wrapper-inner {
        display: flex;
        justify-content: space-between;
    }
</style>