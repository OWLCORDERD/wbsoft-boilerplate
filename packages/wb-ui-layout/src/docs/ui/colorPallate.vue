<template>
  <div class="color-palette">

    <!-- ── 1. 키 컬러 ──────────────────────────────────────────────────────── -->
    <div class="cp-section">
      <div class="cp-section__header">
        <h3 class="cp-section__title">키 컬러(Key Color)</h3>
        <span class="cp-section__badge">동적 변경 가능</span>
      </div>
      <p class="cp-section__desc">
        키 컬러는 디자인에서 핵심적인 역할을 하는 색상으로 디자인 전반에서 통일성을 유지하고 일관된 분위기를 형성하는데 사용합니다.
      </p>

      <div class="cp-key-grid">
        <div
          v-for="theme in KEY_THEMES"
          :key="theme.id"
          :class="['cp-key-theme', { 'cp-key-theme--active': activeTheme === theme.id }]"
        >
          <div class="cp-key-theme__header">
            <span class="cp-key-theme__name">{{ theme.label }}</span>
            <button
              :class="['cp-key-theme__apply', { 'cp-key-theme__apply--applied': activeTheme === theme.id }]"
              @click="applyTheme(theme)"
            >
              {{ activeTheme === theme.id ? '✓ 적용됨' : '적용' }}
            </button>
          </div>
          <div class="cp-key-shades">
            <div v-for="shade in theme.shades" :key="shade.label" class="cp-key-shade">
              <div class="cp-key-shade__block" :style="{ background: shade.hex }" />
              <div class="cp-key-shade__info">
                <span class="cp-key-shade__label">{{ shade.label }}</span>
                <DocsCodeBadge :text="shade.hex" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 2. 서브 컬러 (무채색 고정) ────────────────────────────────────────── -->
    <div class="cp-section">
      <div class="cp-section__header">
        <h3 class="cp-section__title">서브 컬러(Neutral color 무채색)</h3>
        <span class="cp-section__badge cp-section__badge--fixed">고정</span>
      </div>
      <p class="cp-section__desc">
        서브 컬러(Sub Color)는 글자와 영역의 배경색과 선색으로 사용합니다.
      </p>

      <div class="cp-sub-group">
        <div class="cp-sub-group__label">Typography</div>
        <div class="cp-sub-row">
          <div v-for="c in SUB_TYPOGRAPHY" :key="c.hex" class="cp-sub-swatch">
            <div class="cp-sub-swatch__block" :style="{ background: c.hex }" />
            <DocsCodeBadge :text="c.hex" />
          </div>
        </div>
      </div>

      <div class="cp-sub-group">
        <div class="cp-sub-group__label">Background &amp; Border</div>
        <div class="cp-sub-row">
          <div v-for="c in SUB_BG_BORDER" :key="c.hex" class="cp-sub-swatch">
            <div class="cp-sub-swatch__block cp-sub-swatch__block--bordered" :style="{ background: c.hex }" />
            <DocsCodeBadge :text="c.hex" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── 3. 포인트 컬러 ──────────────────────────────────────────────────── -->
    <div class="cp-section">
      <div class="cp-section__header">
        <h3 class="cp-section__title">포인트 컬러(Point Color)</h3>
        <span class="cp-section__badge cp-section__badge--fixed">고정</span>
      </div>
      <p class="cp-section__desc">
        포인트 컬러는 전체 디자인이나 콘텐츠에서 특정 부분을 강조하거나 시선을 집중시키기 위해 사용합니다.
      </p>

      <!-- Table & Typography -->
      <div class="cp-sub-group">
        <div class="cp-sub-group__label">Table &amp; Typography</div>
        <div class="cp-sub-row">
          <div v-for="c in POINT_TABLE_TYPO" :key="c.hex" class="cp-sub-swatch">
            <div class="cp-sub-swatch__block cp-sub-swatch__block--bordered" :style="{ background: c.hex }" />
            <DocsCodeBadge :text="c.hex" />
          </div>
        </div>
      </div>

      <!-- 신호등 -->
      <div class="cp-sub-group">
        <div class="cp-sub-group__label">
          신호등
          <span class="cp-sub-group__note">상태(Status)를 은유로 표현 — 텍스트/배경 쌍으로 사용</span>
        </div>
        <div class="cp-status-grid">
          <div v-for="s in POINT_STATUS" :key="s.label" class="cp-status-pair">
            <div class="cp-status-pair__swatches">
              <div class="cp-status-pair__txt" :style="{ background: s.txt }" />
              <div class="cp-status-pair__bg"  :style="{ background: s.bg }" />
            </div>
            <div class="cp-status-pair__codes">
              <DocsCodeBadge :text="s.txt" />
              <DocsCodeBadge :text="s.bg" />
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Color -->
      <div class="cp-sub-group">
        <div class="cp-sub-group__label">
          Dashboard Color
          <span class="cp-sub-group__note">데이터 시각화 차트용 — Tone in Tone 3단계</span>
        </div>
        <div class="cp-dashboard">
          <div v-for="row in DASHBOARD_ROWS" :key="row.label" class="cp-dashboard__row">
            <span class="cp-dashboard__row-label">{{ row.label }}</span>
            <div class="cp-dashboard__swatches">
              <div
                v-for="hex in row.colors"
                :key="hex"
                class="cp-dashboard__swatch"
                :style="{ background: hex }"
              >
                <span class="cp-dashboard__tooltip">{{ hex }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// ── 키 컬러 ─────────────────────────────────────────────────────────────────
interface KeyShade  { label: string; hex: string; cssVar: string }
interface KeyTheme  { id: string; label: string; shades: KeyShade[] }

const KEY_THEMES: KeyTheme[] = [
  {
    id: 'Indigo Blue', label: 'Indigo Blue',
    shades: [
      { label: 'Dark',    hex: '#3d4282', cssVar: '--colorSub' },
      { label: 'Default', hex: '#4a509f', cssVar: '--colorMain' },
      { label: 'Medium',  hex: '#6e73b2', cssVar: '--key-medium' },
      { label: 'Light',   hex: '#f2f3f8', cssVar: '--colorClear' },
    ],
  },
  {
    id: 'Cobalt Blue', label: 'Cobalt Blue',
    shades: [
      { label: 'Dark',    hex: '#27428f', cssVar: '--key-dark' },
      { label: 'Default', hex: '#345abf', cssVar: '--key-default' },
      { label: 'Medium',  hex: '#5d7bcc', cssVar: '--key-medium' },
      { label: 'Light',   hex: '#f1f3fa', cssVar: '--key-light' },
    ],
  },
  {
    id: 'Violet Purple', label: 'Violet Purple',
    shades: [
      { label: 'Dark',    hex: '#4d338a', cssVar: '--key-dark' },
      { label: 'Default', hex: '#6644b6', cssVar: '--key-default' },
      { label: 'Medium',  hex: '#8569c5', cssVar: '--key-medium' },
      { label: 'Light',   hex: '#f4f2fa', cssVar: '--key-light' },
    ],
  },
  {
    id: 'Sea Green', label: 'Sea Green',
    shades: [
      { label: 'Dark',    hex: '#105e51', cssVar: '--key-dark' },
      { label: 'Default', hex: '#147c6c', cssVar: '--key-default' },
      { label: 'Medium',  hex: '#439689', cssVar: '--key-medium' },
      { label: 'Light',   hex: '#f2fdfb', cssVar: '--key-light' },
    ],
  },
]

const activeTheme = computed(() => {
  return KEY_THEMES.find((theme) => theme.shades[1]?.hex.split('#')[1] === code.value)?.id || 'Indigo Blue';
});

const { $homepage } = useNuxtApp();

const { colorCode: code, font, colorType: type, defaultColorSet, themeColorSelector } = $homepage;

function applyTheme(theme: KeyTheme) {
  if (type.value === 'theme') {
    code.value = theme.shades[1]?.hex.split('#')[1] || code.value;
  }
}

// ── 서브 컬러 (무채색 고정) ──────────────────────────────────────────────────
const SUB_TYPOGRAPHY = [
  { hex: '#333333' }, { hex: '#555555' }, { hex: '#777777' },
  { hex: '#888888' }, { hex: '#999999' }, { hex: '#C2C2C2' }, { hex: '#CCCCCC' },
]

const SUB_BG_BORDER = [
  { hex: '#C2C2C2' }, { hex: '#D7D7D7' }, { hex: '#E8E8E8' },
  { hex: '#EAEAEA' }, { hex: '#F0F0F0' }, { hex: '#F4F4F4' }, { hex: '#F9F9F9' },
]

// ── 포인트 컬러 ──────────────────────────────────────────────────────────────
const POINT_TABLE_TYPO = [
  { hex: '#00A9FF' }, { hex: '#ECF5FF' },
  { hex: '#FFF9E5' }, { hex: '#FD8788' }, { hex: '#FF3B30' },
]

const POINT_STATUS = [
  { label: '분홍', txt: '#E55ED8', bg: '#FFEEFD' },
  { label: '보라', txt: '#A072EB', bg: '#F6F1FD' },
  { label: '파랑', txt: '#47A1E6', bg: '#ECF5FC' },
  { label: '청록', txt: '#1EB7B9', bg: '#E0F7F7' },
  { label: '초록', txt: '#3DA68C', bg: '#EBF6F3' },
  { label: '주황', txt: '#FF8919', bg: '#FFF3E8' },
  { label: '빨강', txt: '#FC696A', bg: '#FFF0F0' },
]

// Dashboard: colorWheel 10색 × Dark / Default / Light 3단계
const DASHBOARD_ROWS = [
  {
    label: 'Dark',
    colors: ['#A83FA0', '#4A57A8', '#6E42A8', '#2E72B0', '#0E8385', '#237A5C', '#4A8A28', '#C07800', '#C05A0A', '#C04040'],
  },
  {
    label: 'Default',
    colors: ['#EA6BD6', '#7685D7', '#A072EB', '#47A1E6', '#1EB7B9', '#3DA68C', '#72BE48', '#FFA800', '#FF8919', '#FC696A'],
  },
  {
    label: 'Light',
    colors: ['#F9D8F6', '#D8DCF5', '#E8D8F9', '#D4E8F8', '#D4F0F0', '#D8EFE8', '#E2F4D0', '#FFF0CC', '#FFE5CC', '#FFD8D8'],
  },
]
</script>

<style lang="scss" scoped>
.color-palette {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

// ── 섹션 공통 ─────────────────────────────────────────────────────────────────
.cp-section {
  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-heading, #222);
  }

  &__badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
    background: rgba(#147CBC, 0.12);
    color: #147CBC;

    &--fixed {
      background: rgba(#999, 0.12);
      color: #666;
    }
  }

  &__desc {
    font-size: 13px;
    color: var(--text-muted, #888);
    line-height: 1.7;
    margin-bottom: 20px;
  }
}

// ── 키 컬러 ─────────────────────────────────────────────────────────────────
.cp-key-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cp-key-theme {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 14px;
  transition: border-color 0.2s;

  &--active {
    border-color: var(--colorMain);
    box-shadow: 0 0 0 2px rgba(var(--colorMainDark), 0.12);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-heading, #333);
  }

  &__apply {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #d7d7d7;
    color: #666;
    cursor: pointer;
    background: #fff;
    transition: all 0.15s;

    &:hover {
      border-color: var(--colorMain);
      color: var(--colorMain);
    }

    &--applied {
      background: var(--colorMainDark);
      border-color: var(--colorMain);
      color: #fff;

      &:hover {
        border-color: var(--colorMain);
        color: var(--colorMainClear);
      }
    }
  }
}

.cp-key-shades {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cp-key-shade {
  display: flex;
  align-items: center;
  gap: 10px;

  &__block {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: 10px;
    color: var(--text-muted, #999);
    font-weight: 500;
  }
}

// ── 서브 & 포인트 컬러 공통 ────────────────────────────────────────────────────
.cp-sub-group {
  margin-bottom: 20px;

  &__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-heading, #333);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__note {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-muted, #999);
  }
}

.cp-sub-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cp-sub-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  &__block {
    width: 60px;
    height: 48px;
    border-radius: 8px;

    &--bordered {
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
  }
}

// ── 신호등 상태 쌍 ─────────────────────────────────────────────────────────────
.cp-status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cp-status-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  &__swatches {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  &__txt,
  &__bg {
    width: 36px;
    height: 44px;
  }

  &__codes {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }
}

// ── 대시보드 컬러 ──────────────────────────────────────────────────────────────
.cp-dashboard {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__row-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted, #999);
    width: 48px;
    flex-shrink: 0;
    text-align: right;
  }

  &__swatches {
    display: flex;
    gap: 6px;
  }

  &__swatch {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    cursor: default;

    &:hover .cp-dashboard__tooltip {
      opacity: 1;
      transform: translateY(-4px);
    }
  }

  &__tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #333;
    color: #fff;
    font-size: 10px;
    padding: 3px 6px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
}
</style>
