<template>
  <section :id="sectionId" class="section">
    <!-- 페이지 제목 문단 slots -->
    <template v-if="pageTitleSlots">
      <div class="page-title">
        <div class="page-title__kicker">
          <slot name="pageKicker" />
        </div>
        <h1 class="page-title__h1">
          <slot name="pageTitle" />
        </h1>
        <p class="page-title__lead">
          <slot name="pageLead" />
        </p>
      </div>
    </template>

    <!-- 문단 헤딩 제목 slots -->
    <template v-if="sectionHeadingSlots">
      <slot name="heading" />
    </template>

    <!-- DocsCallout: 주의사항, 경고, 팁 강조 문구 -->
    <DocsCallout v-if="callout" :type="callout.type">
      {{ callout.text }}
    </DocsCallout>

    <!-- 문단 내용 slots -->
    <slot name="content" />
  </section>
</template>

<script setup lang="ts">
import DocsCallout from './ui/callout.vue';

export interface calloutType {
  id: string;
  type: 'info' | 'warning' | 'tip';
  text: string;
}

const props = defineProps<{
  sectionId: string;
  callout?: calloutType;
}>();

// 2026.07.16. 섹션별 선언된 slots 한정 렌더링 처리
const slots = useSlots();

// CASE1. 페이지 제목 문단 slots
const pageTitleSlots = computed(() => slots.pageTitle && slots.pageKicker && slots.pageLead);

// CASE2. 문단 헤딩 및 내용 slots
const sectionHeadingSlots = computed(() => slots.heading);
</script>

<style>

</style>