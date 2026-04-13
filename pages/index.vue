<template>
    <div id="wrapper-inner">
        <section>
            <AgGrid
                :gridId="'example-grid'"
                :options="gridOptions"
                @getGrid="getGrid"
            />
        </section>
    </div>
</template>
<script setup lang="ts">
import { AgGrid } from '~/features/agGrid/components/v1/index';
const grid = ref();

const gridOptions = reactive({
    rowData: [
        { name: '2026', company: '네이버', course: '네이버 웍스', version: '1.0.0' }
    ],
    columnDefs: [
        { field: 'year' },
        { field: 'company' },
        { field: 'course' },
        { field: 'version' },
    ],
    pagination: true,
    getRowHeight: () => 25,
})

const getGrid = (_grid: any) => {
    grid.value = _grid;

    console.log(grid.value);
}
</script>
<style lang="scss">
    #wrapper-inner {
        display: flex;
        justify-content: space-between;
    }
</style>