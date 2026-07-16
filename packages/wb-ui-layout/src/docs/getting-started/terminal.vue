<template>
  <div class="code-block">
    <div class="code-block__topbar">
      <div class="code-block__traffic-lights">
        <div class="code-block__dot code-block__dot--red" />
        <div class="code-block__dot code-block__dot--yellow" />
        <div class="code-block__dot code-block__dot--green" />
      </div>
      <span class="code-block__label">Terminal</span>
    </div>
    <div class="code-block__body">
      <div v-for="cmd in commands" :key="cmd" class="code-block__line">
        <span class="code-block__prompt">$</span>
        <span>{{ cmd }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  commands: {
    type: Array as PropType<string[]>,
    required: true,
  },
});
</script>