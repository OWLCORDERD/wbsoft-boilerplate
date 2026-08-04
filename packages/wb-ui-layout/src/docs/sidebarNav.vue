<template>
  <nav class="sidebar__nav">
    <div v-for="group in model" :key="group.group" class="nav-group">
      <button class="nav-group__toggle" @click="emit('toggle-group', group.group)">
        <span class="nav-group__toggle-left">
          <span class="nav-group__icon">{{ group.icon }}</span>
          {{ group.group }}
        </span>
        <span>{{ expandedGroups[group.group] ? '▾' : '›' }}</span>
      </button>

      <div v-if="expandedGroups[group.group]" class="nav-group__items">
        <button
          v-for="item in group.items"
          :key="item.id"
          :class="['nav-group__item', { 'active': activeSection === item.id }]"
          @click="emit('scroll-to', item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavGroup } from '~/layouts/default.vue';

const model = defineModel<NavGroup[]>({ required: true });

defineProps<{
  activeSection: string
  expandedGroups: Record<string, boolean>
}>()

const emit = defineEmits<{
  'toggle-group': [group: string]
  'scroll-to': [id: string]
}>()
</script>
