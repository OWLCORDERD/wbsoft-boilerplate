<template>
    <div class="font-cards">
      <div v-for="font in FONT_CARDS" :key="font.name" class="font-card">
        <div class="font-card__role">{{ font.role }}</div>
        <div class="font-card__name">{{ font.name }}</div>
        <DOCSUiCodeBadge :text="font.code" />
        <div
          :class="'font-card__sample'"
          :data-code="font.code"
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
      <div v-for="(row, i) in TYPE_SCALE.filter((row) => row.type === 'heading')" :key="row.cls" class="type-scale__row">
        <div class="scale-type" v-if="i === 0">{{ row.type === 'heading' ? '제목(Heading)' : row.type === 'body' ? '본문(Body)' : '캡션(Caption)' }}</div>
        <div class="scale-wrapper">
          <DOCSUiCodeBadge :text="row.cls" />
          <div class="scale-size">{{ row.size }}</div>
          <div :style="{ fontSize: row.size, fontWeight: row.weight, color: 'var(--text)', lineHeight: '1.4' }">
            {{ row.sample }}
          </div>
        </div>
      </div>
      <div v-for="(row, i) in TYPE_SCALE.filter((row) => row.type === 'body')" :key="row.cls" class="type-scale__row">
        <div class="scale-type" v-if="i === 0">{{ row.type === 'heading' ? '제목(Heading)' : row.type === 'body' ? '본문(Body)' : '캡션(Caption)' }}</div>
        <div class="scale-wrapper">
          <DOCSUiCodeBadge :text="row.cls" />
          <div class="scale-size">{{ row.size }}</div>
          <div :style="{ fontSize: row.size, fontWeight: row.weight, color: 'var(--text)', lineHeight: '1.4' }">
            {{ row.sample }}
          </div>
        </div>
      </div>
      <div v-for="(row, i) in TYPE_SCALE.filter((row) => row.type === 'caption')" :key="row.cls" class="type-scale__row">
        <div class="scale-type" v-if="i === 0">{{ row.type === 'heading' ? '제목(Heading)' : row.type === 'body' ? '본문(Body)' : '캡션(Caption)' }}</div>
        <div class="scale-wrapper">
          <DOCSUiCodeBadge :text="row.cls" />
          <div class="scale-size">{{ row.size }}</div>
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
    code: '$font-pretendard',
    // 곡선(a g)과 직선 획 비율이 뚜렷한 Pretendard 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    mono: false,
  },
  {
    role: 'Secondary — 보조',
    name: 'Noto Sans KR',
    code: '$font-notosans',
    // 넓은 자간, 획 균일성이 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['400', '700'],
    mono: false,
  },
  {
    role: 'Display — 강조',
    name: 'Elice Digital Baeum',
    code: '$font-elicedigitalbaeum',
    // 둥근 획 끝 처리가 특징
    sample: 'Aa Gg 가나다 123',
    weights: ['400', '700'],
    mono: false,
  },
]

const TYPE_SCALE = [
  { type: 'heading', cls: '$font-adm-xxxl',  size: '26px', weight: '700', sample: '이름, 닉네임으로 사용합니다.' },
  { type: 'heading', cls: '$font-adm-xxl',  size: '24px', weight: '600', sample: '팝업 제목으로 사용합니다.' },
  { type: 'heading', cls: '$font-adm-xl',   size: '22px', weight: '600', sample: '콘텐츠 2뎁스 제목, 3뎁스 탭메뉴로 사용합니다.' },
  { type: 'heading', cls: '$font-adm-lg',   size: '20px', weight: '600', sample: '상세카드 내 제목으로 사용합니다.' },
  { type: 'heading', cls: '$font-adm-md', size: '18px', weight: '400', sample: '문단 제목으로 사용합니다.' },
  { type: 'body', cls: '$font-adm-base',   size: '16px', weight: '400', sample: '본문/보조 텍스트로 사용합니다.' },
  { type: 'body', cls: '$font-adm-sm',   size: '14px', weight: '500', sample: '본문/보조 텍스트로 사용합니다.' },
  { type: 'caption', cls: '$font-adm-xs',   size: '12px', weight: '500', sample: '보조 텍스트로 사용합니다.' },
]
</script>