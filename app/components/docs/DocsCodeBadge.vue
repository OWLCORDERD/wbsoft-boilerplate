<template>
  <span class="code-badge" @click="copy">
    {{ text }}
    <span v-if="copied" class="code-badge__check">✓</span>
    <span v-else class="code-badge__icon">⧉</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>()

const copied = ref(false)

const copy = () => {
  navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
