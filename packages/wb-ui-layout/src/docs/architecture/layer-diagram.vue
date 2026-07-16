<template>
  <div class="layer-diagram">
    <div
      v-for="item in layerItems"
      :key="item.name"
      :class="`layer-item layer-item${item.mod}`"
    >
      <span class="layer-item__id">{{ item.l }}</span>
      <span class="layer-item__name">{{ item.name }}</span>
      <span class="layer-item__arrow">→</span>
      <span class="layer-item__desc">{{ item.desc }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface layerItems {
  mod: string;
  l: string;
  name: string;
  desc: string;
}
const props = defineProps<{
  layerItems: layerItems[];
}>();
</script>