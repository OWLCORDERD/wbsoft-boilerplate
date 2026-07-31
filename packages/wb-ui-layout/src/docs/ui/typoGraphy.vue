<template>
    <div class="font-cards">
      <div v-for="font in FONT_CARDS" :key="font.name" class="font-card">
        <div class="font-card__role">{{ font.role }}</div>
        <div class="font-card__name">{{ font.name }}</div>
        <div
          :class="'font-card__sample' + ' ' + font.code"
        >
          {{ font.sample }}
        </div>
        <div class="font-card__weights">
          <span v-for="w in font.weights" :key="w" class="font-card__weight-chip">{{ w }}</span>
        </div>
      </div>
    </div>

    <div class="type-scale">
      <div class="type-scale__header">Type Scale</div>
      <div v-for="row in TYPE_SCALE" :key="row.cls" class="type-scale__row">
        <div class="type-scale__type">{{ row.type }}</div>
        <div class="type-scale__wrapper">
          <DOCSUiCodeBadge :text="row.cls" />
          <div class="type-scale__size">{{ row.size }}</div>
          <div :style="{ fontSize: row.size, fontWeight: row.weight, color: 'var(--text)', lineHeight: '1.4' }">
            {{ row.sample }}
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const FONT_CARDS = [
  {
    role: 'Primary — 본문/UI',
    name: 'Pretendard',
    code: 'Pretendard',
    // 곡선(a g)과 직선 획 비율이 뚜렷한 Pretendard 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    mono: false,
  },
  {
    role: 'Secondary — 보조',
    name: 'Noto Sans KR',
    code: 'NotoSans',
    // 넓은 자간, 획 균일성이 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['400', '700'],
    mono: false,
  },
  {
    role: 'Display — 강조',
    name: 'Elice Digital Baeum',
    code: 'EliceDigitalBaeum',
    // 둥근 획 끝 처리가 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['400', '700'],
    mono: false,
  },
]

const TYPE_SCALE = [
  { type: 'heading', cls: 'text-4xl',  size: '26px', weight: '700', sample: 'Display Heading' },
  { type: 'heading', cls: 'text-3xl',  size: '24px', weight: '600', sample: 'Section Heading' },
  { type: 'heading', cls: 'text-2xl',   size: '22px', weight: '600', sample: 'Sub-heading' },
  { type: 'heading', cls: 'text-xl',   size: '20px', weight: '600', sample: 'Large Body' },
  { type: 'heading', cls: 'text-lg', size: '18px', weight: '400', sample: '본문 텍스트입니다' },
  { type: 'body', cls: 'text-base',   size: '16px', weight: '400', sample: '보조 설명 텍스트' },
  { type: 'body', cls: 'text-sm',   size: '14px', weight: '500', sample: 'Label / Caption' },
  { type: 'caption', cls: 'text-xs',   size: '12px', weight: '500', sample: 'const x = 1' },
]
</script>