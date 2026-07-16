<template>
  <div :class="'callout callout' + '--' + type">
    <span class="callout__marker">{{ marker }}</span>
    <span class="callout__body"><slot /></span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: 'info' | 'tip' | 'warning' }>()

const marker = computed(() => ({ info: 'ℹ', tip: '✦', warning: '⚠' }[props.type]))
</script>
