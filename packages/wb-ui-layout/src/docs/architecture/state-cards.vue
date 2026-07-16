<template>
<div class="state-cards">
  <div
    v-for="card in stateCards"
    :key="card.tool"
    :class="`state-card state-card${card.mod}`"
  >
    <div class="state-card__scope">{{ card.scope }}</div>
    <div class="state-card__tool">{{ card.tool }}</div>
    <div class="state-card__desc">{{ card.desc }}</div>
  </div>
</div>
</template>

<script lang="ts" setup>
interface stateCards {
  mod: string;
  scope: string;
  tool: string;
  desc: string;
}
const props = defineProps<{
  stateCards: stateCards[];
}>();
</script>