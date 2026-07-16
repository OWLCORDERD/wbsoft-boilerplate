<template>
  <div class="feature-grid">
    <div v-for="card in cards" :key="card.label" class="feature-card">
      <div class="feature-card__icon">{{ card.icon }}</div>
      <div class="feature-card__title">{{ card.label }}</div>
      <div class="feature-card__desc">{{ card.desc }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface fetureCards {
  icon: string;
  label: string;
  desc: string;
}
const props = defineProps<{
  cards: fetureCards[];
}>();
</script>