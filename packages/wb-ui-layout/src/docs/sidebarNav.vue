<template>
  <nav class="sidebar__nav">
    <div v-for="group in NAV" :key="group.group" class="nav-group">
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
type NavItem = { label: string; id: string }
type NavGroup = { group: string; icon: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    group: '시작하기',
    icon: '📖',
    items: [
      { label: '소개', id: 'introduction' },
      { label: '빠른 시작', id: 'quick-start' },
      { label: '프로젝트 생성', id: 'installation' },
    ],
  },
  {
    group: '아키텍처',
    icon: '🗂',
    items: [
      { label: '프로젝트 구조', id: 'project-structure' },
      { label: '레이어 & 모듈', id: 'layers-modules' },
      { label: '상태 관리', id: 'state-management' },
    ],
  },
  {
    group: '디자인 시스템',
    icon: '🎨',
    items: [
      { label: '컬러 팔레트', id: 'color-palette' },
      { label: '타이포그래피', id: 'typography' },
      { label: '스페이싱 & 그리드', id: 'spacing-grid' },
      { label: 'CSS 변수 레퍼런스', id: 'css-variables' },
    ],
  },
  {
    group: '컴포넌트',
    icon: '📦',
    items: [
      { label: '버튼', id: 'buttons' },
      { label: '폼 엘리먼트', id: 'form-elements' },
      { label: '카드 & 패널', id: 'cards-panels' },
      { label: '피드백', id: 'feedback' },
    ],
  },
]

defineProps<{
  activeSection: string
  expandedGroups: Record<string, boolean>
}>()

const emit = defineEmits<{
  'toggle-group': [group: string]
  'scroll-to': [id: string]
}>()
</script>
