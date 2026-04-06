<template>
    <div ref="editor"/>
</template>
<script setup>
    const editor = ref();

    // editor setting props
    const props = defineProps(["editorSettings"]);

    onMounted(() => {
        if(editor.value) {
            editor.value = toastEditorInstance(
            editor.value,
            props.editorSettings.initialEditType,
            props.editorSettings.defaultOptions,
            props.editorSettings.height,
            props.editorSettings.initialValue
        )
        }
    })
</script>
<style lang="scss">
    
</style>