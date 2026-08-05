<template>
  <div class="code-block">
    <div class="code-block__topbar">
      <!-- 문단별로 독립적인 터미널 정보 탭 UI 영역 -->
      <div class="code-block__tab">
        <slot name="tab_name"></slot>
      </div>
      <!-- 터미널 닫기/확대/종료 신호등 -->
      <div class="code-block__traffic-lights">
        <div class="code-block__dot code-block__dot--red" />
        <div class="code-block__dot code-block__dot--yellow" />
        <div class="code-block__dot code-block__dot--green" />
      </div>
      <!-- 터미널 라벨 -->
      <span class="code-block__label">Terminal</span>
    </div>
    <!-- 터미널 커맨드 목록 -->
    <div class="code-block__body" v-if="commands && commands.length > 0">
      <div v-for="cmd in commands" :key="cmd" class="code-block__line">
        <span class="code-block__prompt">$</span>
        <span>{{ cmd }}</span>
      </div>
    </div>

    <!-- 코드 컨밴션 가이드 목록 -->
    <div class="code-block__body" v-if="convention && convention.length > 0">
      <div
        v-for="conventionItem in convention"
        :key="conventionItem.label"
        class="code-block__line"
        style="margin-bottom: 10px;"
      >
        <span class="code-block__prompt">{{ conventionItem.label }}</span>
        <span>{{ conventionItem.desc }}</span>
        <CodeBadge :text="conventionItem.command" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CodeBadge from '../ui/codeBadge.vue';

const props = defineProps({
  commands: {
    type: Array as PropType<string[]>,
    required: false,
  },
  convention: {
    type: Array as PropType<{ label: string, desc: string, command: string }[]>,
    required: false,
  }
});
</script>