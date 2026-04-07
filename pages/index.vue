<template>
    <div id="wrapper-inner">
        <section>
            <ClientOnly>
            <Suspense>
                <template #default>
                    <component :is="gridComponent" :options="gridOptions" @getGrid="getGrid" />
                </template>

                <template #fallback>
                    <div>Loading...</div>
                </template>
            </Suspense>
        </ClientOnly>
        </section>
    </div>
</template>
<script setup lang="ts">
const gridComponent = defineAsyncComponent(() => import('~/features/lxp/components/v1/agGrid/agGridEditor.vue'));

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