<template>
  <!-- ── Breadcrumb ────────────────────────────────────────────────────── -->
  <nav class="breadcrumb">
    <span>가이드</span>
    <span class="breadcrumb__sep">›</span>
    <span class="breadcrumb__current">소개</span>
  </nav>

  <!-- ── Introduction ──────────────────────────────────────────────────── -->
  <DOCSSection 
    sectionId="introduction"
    :callout="docCalloutList.find((callout: calloutType) => callout.id === 'introduction')"
  >
    <template #pageKicker>Getting Started</template>
    <template #pageTitle>소개</template>
    <template #pageLead>
      모든 신규 프로젝트마다 확장 가능하고 일관된 방식으로 웹 애플리케이션을 구축하기 위한
      <strong>아키텍처 보일러플레이트</strong>입니다.
      <strong>공통 UI 컴포넌트 패키지</strong> 및 <strong>상태 관리 패턴</strong>과 <strong>CSS 디자인 토큰</strong> 등을 포함한 <strong>통합 개발 환경</strong>을 제공합니다.
    </template>

    <template #content>
      <DocsFeatureGrid :cards="FEATURE_CARDS" />
    </template>
  </DOCSSection>

  <!-- ── Quick Start ────────────────────────────────────────────────────── -->
  <DOCSSection sectionId="quick-start">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">⚡</span>
        빠른 시작
      </h2>
      <p class="section__lead">아래 명령어로 pnpm workspace 패키지를 설치하고 개발 서버를 시작합니다.</p>
    </template>

    <template #content>
      <DOCSGettingStartedTerminal :commands="QUICK_START_CMDS" />
    </template>
  </DOCSSection>

  <!-- ── Project Structure ──────────────────────────────────────────────── -->
  <DOCSSection sectionId="project-structure">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">📁</span>프로젝트 구조
      </h2>
    </template>

    <template #content>
      <p class="section__lead">
        모든 프로젝트는 아래 디렉토리 구조를 따릅니다. 각 레이어는 명확한 역할을 가지며
        상위 레이어가 하위 레이어를 단방향으로 참조하는 의존성 규칙을 지킵니다.
      </p>

      <DOCSArchitectureFileTree />
    </template>
  </DOCSSection>

  <!-- ── Layers & Modules ───────────────────────────────────────────────── -->
  <DOCSSection sectionId="layers-modules">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">🗂</span>아이콘 디렉토리
      </h2>
    </template>

    <template #content>
      <DOCSArchitectureIconStructure />
    </template>
    <!-- <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">🗂</span>레이어 & 모듈
      </h2>

      <p class="section__lead">
        아키텍처는 4개의 레이어로 구성되며, 화살표 방향으로만 의존성을 가집니다. 역방향 참조는 금지됩니다.
      </p>
    </template>

    <template #content>
      <DOCSArchitectureLayerDiagram :layerItems="LAYER_ITEMS" />
    </template> -->
  </DOCSSection>

  <!-- ── State Management ───────────────────────────────────────────────── -->
  <DOCSSection sectionId="state-management"
  :callout="docCalloutList.find((callout) => callout.id === 'state-management')">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">⊞</span>상태 관리
      </h2>
    </template>

    <template #content>
      <DOCSArchitectureStateCards :stateCards="STATE_CARDS" />
    </template>
  </DOCSSection>

  <!-- ── Color Palette ──────────────────────────────────────────────────── -->
  <DOCSSection sectionId="color-palette">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">🎨</span>컬러 팔레트
      </h2>
    <p class="section__lead">
      모든 색상은 SCSS 변수와 CSS 커스텀 프로퍼티로 이중 정의됩니다.
      컴포넌트에서는 반드시 CSS 변수를 참조하고, 계산이 필요한 경우에만 SCSS 변수를 사용하세요.
    </p>
    </template>
    <template #content>
      <DOCSUiColorPallate />
    </template>
  </DOCSSection>

  <!-- ── Typography ─────────────────────────────────────────────────────── -->

  <DOCSSection sectionId="typography">
    <template #heading>
      <h2 class="section-heading">
        <span class="section-heading__icon">𝐓</span>타이포그래피
      </h2>
    </template>
    <template #content>
      <DOCSUiTypoGraphy />
    </template>
  </DOCSSection>

  <!-- ── Spacing & Grid ─────────────────────────────────────────────────── -->
  <section id="spacing-grid" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">⊞</span>스페이싱 & 그리드
    </h2>
    <p class="section__lead">
      사스다 디자인 시스템 기반으로 구성된 gap 여백 스케일들을 SCSS 변수 <DOCSUiCodeBadge text="$space-1" /> ~ <DOCSUiCodeBadge text="$space-16" /> 처럼 참조하거나
      CSS 변수로 직접 사용합니다.
    </p>

    <div class="spacing-scale">
      <div v-for="s in SPACING_SCALE" :key="s.name" class="spacing-scale__row">
        <span class="spacing-scale__name">{{ s.name }}</span>
        <div class="spacing-scale__bar" :style="{ width: s.px }" />
        <span class="spacing-scale__values">{{ s.px }} / {{ s.rem }}</span>
      </div>
    </div>

    <div class="palette-section__label" style="margin-bottom: 12px">폼 요소 시스템</div>
    <div class="grid-demo">
      <div v-for="i in 12" :key="i" class="grid-demo__col">{{ i }}</div>
    </div>
    <div class="grid-caption">폼 요소 기본 gap: 20px ($space-6)</div>
  </section>

  <!-- ── CSS Variables ──────────────────────────────────────────────────── -->
  <!-- <section id="css-variables" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">{}</span>CSS 변수 레퍼런스
    </h2>
    <p class="section__lead">
      <DocsCodeBadge text="src/styles/scss/_tokens.scss" />에서 정의되는 전역 디자인 토큰입니다.
      SCSS 변수는 컴파일 타임, CSS 커스텀 프로퍼티는 런타임 테마 전환에 사용됩니다.
    </p>

    <div class="vars-table">
      <div class="vars-table__head">
        <span>토큰</span>
        <span>값</span>
        <span>사용처</span>
        <span />
      </div>
      <div v-for="v in CSS_VARS" :key="v.token" class="vars-table__row">
        <span class="vars-table__token">{{ v.token }}</span>
        <div class="vars-table__value">
          <div v-if="v.hex" class="vars-table__color-dot" :style="{ background: v.hex }" />
          <span>{{ v.value }}</span>
        </div>
        <span class="vars-table__usage">{{ v.usage }}</span>
        <button
          :class="['vars-table__copy', { 'vars-table__copy--copied': copiedVar === v.token }]"
          @click="copyVar(v.token)"
        >
          {{ copiedVar === v.token ? '✓' : '⧉' }}
        </button>
      </div>
    </div>
  </section> -->

  <!-- ── Buttons ────────────────────────────────────────────────────────── -->
  <!-- <section id="buttons" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">□</span>컴포넌트 가이드
    </h2>
    <h3 class="subsection-heading">버튼</h3>

    <div class="tab-strip">
      <button
        v-for="tab in BUTTON_TABS"
        :key="tab"
        :class="['tab-strip__tab', { 'tab-strip__tab--active': activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="showcase">
      <div class="showcase__label">변형</div>
      <div class="showcase__row">
        <template v-if="activeTab === 'primary'">
          <button class="btn btn--md btn--primary">Default</button>
          <button class="btn btn--md btn--primary" style="background: var(--brand-hover)">Hover</button>
          <button class="btn btn--md btn--primary">⚡ With Icon</button>
          <button class="btn btn--md btn--primary" disabled>Disabled</button>
          <button class="btn btn--icon btn--primary">⚡</button>
        </template>
        <template v-else-if="activeTab === 'secondary'">
          <button class="btn btn--md btn--secondary">Default</button>
          <button class="btn btn--md btn--secondary">🗂 With Icon</button>
        </template>
        <template v-else-if="activeTab === 'outline'">
          <button class="btn btn--md btn--outline">Violet</button>
          <button class="btn btn--md btn--outline btn--outline-accent">Accent</button>
        </template>
        <template v-else-if="activeTab === 'ghost'">
          <button class="btn btn--md btn--ghost">Default</button>
          <button class="btn btn--md btn--ghost">⊞ With Icon</button>
        </template>
        <template v-else-if="activeTab === 'danger'">
          <button class="btn btn--md btn--danger">Destructive</button>
          <button class="btn btn--md btn--danger-outline">Outline</button>
        </template>
      </div>

      <div class="showcase__label">사이즈</div>
      <div class="showcase__row">
        <button class="btn btn--xs btn--primary">xs</button>
        <button class="btn btn--sm btn--primary">sm</button>
        <button class="btn btn--md btn--primary">md</button>
        <button class="btn btn--lg btn--primary">lg</button>
        <button class="btn btn--xl btn--primary">xl</button>
      </div>
    </div>
  </section> -->

  <!-- ── Form Elements ──────────────────────────────────────────────────── -->
  <!-- <section id="form-elements" class="section">
    <h3 class="subsection-heading">폼 엘리먼트</h3>
    <div class="form-grid">
      <div class="field">
        <label class="field__label">텍스트 입력</label>
        <input class="input" type="text" placeholder="플레이스홀더" readonly />
      </div>
      <div class="field">
        <label class="field__label">포커스 상태</label>
        <input
          class="input"
          type="text"
          value="활성 입력값"
          style="border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-dim)"
          readonly
        />
      </div>
      <div class="field">
        <label class="field__label">셀렉트</label>
        <select class="select">
          <option>옵션 선택</option>
          <option>옵션 A</option>
          <option>옵션 B</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label">에러 상태</label>
        <input class="input input--error" type="text" value="잘못된 입력값" readonly />
        <span class="field__error-msg">이 필드는 필수입니다.</span>
      </div>
    </div>
  </section> -->

  <!-- ── Cards & Panels ─────────────────────────────────────────────────── -->
  <!-- <section id="cards-panels" class="section">
    <h3 class="subsection-heading">카드 & 패널</h3>
    <div class="card-grid">
      <div v-for="card in CARD_ITEMS" :key="card.title" class="card">
        <div class="card__header">
          <div class="card__title">{{ card.title }}</div>
          <span :class="`badge ${card.badgeClass}`">{{ card.badgeLabel }}</span>
        </div>
        <div class="card__body">{{ card.desc }}</div>
        <div class="card__footer">
          <button class="btn btn--sm btn--primary">Primary</button>
          <button class="btn btn--sm btn--secondary">Secondary</button>
        </div>
      </div>
    </div>
  </section> -->

  <!-- ── Feedback ───────────────────────────────────────────────────────── -->
  <!-- <section id="feedback" class="section">
    <h3 class="subsection-heading">피드백 컴포넌트</h3>
    <div class="alerts-stack">
      <div
        v-for="alert in ALERT_VARIANTS"
        :key="alert.mod"
        :class="`alert alert--${alert.mod}`"
      >
        <span class="alert__icon">{{ alert.icon }}</span>
        <div class="alert__body">
          <span class="alert__label">{{ alert.label }}</span>
          {{ alert.msg }}
        </div>
      </div>
    </div>

    <div class="badge-row" style="margin-top: 24px">
      <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-subtle); width: 100%; margin-bottom: 8px">
        배지 & 태그
      </div>
      <span class="badge badge--violet">Violet</span>
      <span class="badge badge--cyan">Cyan</span>
      <span class="badge badge--green">Green</span>
      <span class="badge badge--amber">Amber</span>
      <span class="badge badge--red">Red</span>
      <span class="badge badge--neutral">Neutral</span>
    </div>
  </section> -->
</template>

<script setup lang="ts">
import type { calloutType } from '~~/packages/wb-ui-layout/src/docs/section.vue'

// ── Types ────────────────────────────────────────────────────────────────────
type FileItem = {
  type: 'dir' | 'file'
  name: string
  note?: string
  children?: FileItem[]
}

// ── State ────────────────────────────────────────────────────────────────────
const copiedVar = ref<string | null>(null)
const activeTab = ref<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary')

const docCalloutList = ref<calloutType[]>([
  {
    type: 'tip',
    id: 'introduction',
    text: '이 가이드라인은 지속적으로 업데이트됩니다. 새로운 패턴이나 컴포넌트 추가 제안은 내부 GitHub 리포지토리를 통해 PR을 제출해주세요.'
  },
  {
    type: 'warning',
    id: 'state-management',
    text: '모든 전역 상태를 Pinia로 관리하지 마세요. 서버 상태는 useFetch/useAsyncData, 로컬 UI 상태는 ref를 우선 사용하세요.'
  }
]);

// ── Static data ──────────────────────────────────────────────────────────────
const BUTTON_TABS = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const

const FEATURE_CARDS = [
  { icon: '⚡', label: '빠른 개발', desc: '공통 컴포넌트로 반복 작업 최소화' },
  { icon: '🗂', label: '레이어 구조', desc: '명확한 관심사 분리와 단방향 의존성 규칙' },
  { icon: '🎨', label: '디자인 토큰', desc: 'CSS 변수 기반의 일관된 스타일 시스템' },
]

const QUICK_START_CMDS = ['pnpm install', 'pnpm run local']

const CSS_VARS = [
  { token: '--bg',           value: '#0C0D18',             usage: '페이지 전체 배경',   hex: '#0C0D18' },
  { token: '--bg-card',      value: '#111223',             usage: '카드 / 패널 배경',   hex: '#111223' },
  { token: '--bg-secondary', value: '#1A1C30',             usage: '2차 서피스',         hex: '#1A1C30' },
  { token: '--text',         value: '#CDD0E8',             usage: '기본 텍스트',        hex: '#CDD0E8' },
  { token: '--text-heading', value: '#E8EAFF',             usage: '헤딩 텍스트',        hex: '#E8EAFF' },
  { token: '--text-muted',   value: '#5C607E',             usage: '캡션, 레이블',       hex: '#5C607E' },
  { token: '--brand',        value: '#8B5CF6',             usage: '주요 인터랙션 색상', hex: '#8B5CF6' },
  { token: '--brand-hover',  value: '#7C3AED',             usage: '브랜드 호버 상태',   hex: '#7C3AED' },
  { token: '--accent',       value: '#06B6D4',             usage: '강조 하이라이트',    hex: '#06B6D4' },
  { token: '--border',       value: 'rgba(139,92,246,.14)',usage: '구분선',             hex: undefined },
  { token: '--success',      value: '#10B981',             usage: '성공 상태',          hex: '#10B981' },
  { token: '--warning',      value: '#F59E0B',             usage: '경고 상태',          hex: '#F59E0B' },
  { token: '--error',        value: '#EF4444',             usage: '오류 상태',          hex: '#EF4444' },
  { token: '--font-sans',    value: "'Plus Jakarta Sans'", usage: '기본 폰트',          hex: undefined },
  { token: '--font-mono',    value: "'JetBrains Mono'",   usage: '코드 / 레이블 폰트', hex: undefined },
  { token: '--radius-lg',    value: '10px',               usage: '기본 라운드',        hex: undefined },
]

const SPACING_SCALE = [
  { name: '1',  px: '4px',  rem: '0.25rem' },
  { name: '2',  px: '5px',  rem: '0.5rem'  },
  { name: '3',  px: '6px', rem: '0.75rem' },
  { name: '4',  px: '16px', rem: '1rem'    },
  { name: '6',  px: '20px', rem: '1.5rem'  },
  { name: '8',  px: '28px', rem: '2rem'    },
  { name: '10', px: '32px', rem: '2.5rem'  },
  { name: '12', px: '36px', rem: '3rem'    },
  { name: '16', px: '40px', rem: '4rem'    },
]

const LAYER_ITEMS = [
  { mod: '--violet', l: 'L4', name: 'Pages',      desc: '라우트 단위 페이지. 레이아웃 조합만 담당. 비즈니스 로직 없음.' },
  { mod: '--cyan',   l: 'L3', name: 'Features',   desc: '도메인 로직, 로컬 상태, API 호출. 독립적으로 이동 가능한 단위.' },
  { mod: '--green',  l: 'L2', name: 'Components', desc: '재사용 가능한 UI 컴포넌트. 도메인 의존성 없음.' },
  { mod: '--amber',  l: 'L1', name: 'Lib / Hooks',desc: '프레임워크에 독립적인 유틸리티, API 클라이언트, 커스텀 훅.' },
]

const STATE_CARDS = [
  { mod: '--green',  scope: '컴포넌트 로컬',  tool: 'ref / reactive',   desc: '폼 열림/닫힘, 입력값, 토글 등 컴포넌트 내부 상태' },
  { mod: '--cyan',   scope: '서버 상태',      tool: 'useFetch / useAsyncData', desc: 'API 데이터 페칭, 캐싱, 동기화. 전역 공유 불필요' },
  { mod: '--violet', scope: '클라이언트 전역', tool: 'Pinia',            desc: '인증 정보, 테마, 여러 컴포넌트가 구독하는 UI 상태' },
]

const CARD_ITEMS = [
  { title: '기본 카드',      desc: '테두리와 배경을 가진 기본 카드 컴포넌트입니다.',       badgeClass: 'badge--violet', badgeLabel: 'Default' },
  { title: '하이라이트 카드', desc: '중요한 정보를 강조할 때 사용하는 액센트 카드입니다.', badgeClass: 'badge--cyan',   badgeLabel: 'Accent'  },
]

const ALERT_VARIANTS = [
  { mod: 'success', icon: '✓', label: '성공', msg: '설정이 성공적으로 저장되었습니다.' },
  { mod: 'info',    icon: 'ℹ', label: '안내', msg: '새로운 업데이트가 준비되었습니다.' },
  { mod: 'warning', icon: '⚠', label: '경고', msg: '이 작업은 되돌릴 수 없습니다.' },
  { mod: 'error',   icon: '✕', label: '오류', msg: '서버와 연결할 수 없습니다. 다시 시도해 주세요.' },
]

// ── Methods ──────────────────────────────────────────────────────────────────
const copyVar = (token: string) => {
  navigator.clipboard.writeText(token)
  copiedVar.value = token
  setTimeout(() => (copiedVar.value = null), 1500)
}
</script>
