<template>
    <ClientOnly>
        <common-toast-TuiEditor :editorSettings="editorSettings" />
    </ClientOnly>
</template>
<script setup>
    // toast editor 설정 값 세팅 props
    const editorSettings = {
        initialEditType : "Markdown",
        height : "500px",
        initialValue : "오늘의 히스토리를 작성해주세요.",
        defaultOptions : {
            toolbarItems: [
                ['Headings', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent']
            ]
        }
    }
</script>
<style lang="scss">
</style>