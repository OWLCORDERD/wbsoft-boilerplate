<template>
  <!-- ── Breadcrumb ────────────────────────────────────────────────────── -->
  <nav class="breadcrumb">
    <span>가이드</span>
    <span class="breadcrumb__sep">›</span>
    <span class="breadcrumb__current">소개</span>
  </nav>

  <!-- ── Introduction ──────────────────────────────────────────────────── -->
  <section id="introduction" class="section">
    <div class="page-title">
      <div class="page-title__kicker">Getting Started</div>
      <h1 class="page-title__h1">소개</h1>
      <p class="page-title__lead">
        자사 프레임워크는 확장 가능하고 일관된 방식으로 웹 애플리케이션을 구축하기 위한
        <strong>아키텍처 보일러플레이트</strong>입니다.
        공통 UI 컴포넌트, 상태 관리 패턴, CSS 디자인 토큰을 포함한 통합 개발 환경을 제공합니다.
      </p>
    </div>

    <DocsCallout type="tip">
      이 가이드라인은 지속적으로 업데이트됩니다. 새로운 패턴이나 컴포넌트 추가 제안은 내부 GitHub
      리포지토리를 통해 PR을 제출해주세요.
    </DocsCallout>

    <div class="feature-grid">
      <div v-for="card in FEATURE_CARDS" :key="card.label" class="feature-card">
        <div class="feature-card__icon">{{ card.icon }}</div>
        <div class="feature-card__title">{{ card.label }}</div>
        <div class="feature-card__desc">{{ card.desc }}</div>
      </div>
    </div>
  </section>

  <!-- ── Quick Start ────────────────────────────────────────────────────── -->
  <section id="quick-start" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">⚡</span>빠른 시작
    </h2>
    <p class="section__lead">아래 명령어로 새 프로젝트를 생성하고 개발 서버를 시작합니다.</p>

    <div class="code-block">
      <div class="code-block__topbar">
        <div class="code-block__traffic-lights">
          <div class="code-block__dot code-block__dot--red" />
          <div class="code-block__dot code-block__dot--yellow" />
          <div class="code-block__dot code-block__dot--green" />
        </div>
        <span class="code-block__label">Terminal</span>
      </div>
      <div class="code-block__body">
        <div v-for="cmd in QUICK_START_CMDS" :key="cmd" class="code-block__line">
          <span class="code-block__prompt">$</span>
          <span>{{ cmd }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Installation ───────────────────────────────────────────────────── -->
  <section id="installation" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">📦</span>프로젝트 생성
    </h2>
    <DocsCallout type="info">Node.js 18 이상, pnpm 8 이상이 필요합니다.</DocsCallout>
    <p class="section__lead">
      생성된 프로젝트는 TypeScript, ESLint, Prettier, Dart Sass, Vitest가 사전 설정되어 있습니다.
      별도의 추가 설정 없이 바로 개발을 시작할 수 있습니다.
    </p>
  </section>

  <!-- ── Project Structure ──────────────────────────────────────────────── -->
  <section id="project-structure" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">📁</span>프로젝트 구조
    </h2>
    <p class="section__lead">
      모든 프로젝트는 아래 디렉토리 구조를 따릅니다. 각 레이어는 명확한 역할을 가지며
      상위 레이어가 하위 레이어를 단방향으로 참조하는 의존성 규칙을 지킵니다.
    </p>

    <div class="file-tree">
      <div class="file-tree__topbar">
        <div class="file-tree__traffic-lights">
          <div class="file-tree__dot file-tree__dot--red" />
          <div class="file-tree__dot file-tree__dot--yellow" />
          <div class="file-tree__dot file-tree__dot--green" />
        </div>
        <span class="file-tree__root-label">project/</span>
      </div>
      <div class="file-tree__body">
        <div
          v-for="(item, i) in flatFileTree"
          :key="i"
          class="file-tree__item"
          :style="{ paddingLeft: item.depth * 16 + 'px' }"
        >
          <span :class="`file-tree__item-icon file-tree__item-icon--${item.type}`">
            {{ item.type === 'dir' ? '📂' : '📄' }}
          </span>
          <span :class="`file-tree__item-name file-tree__item-name--${item.type}`">
            {{ item.name }}
          </span>
          <span v-if="item.note" class="file-tree__item-note"># {{ item.note }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Layers & Modules ───────────────────────────────────────────────── -->
  <section id="layers-modules" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">🗂</span>레이어 & 모듈
    </h2>
    <p class="section__lead">
      아키텍처는 4개의 레이어로 구성되며, 화살표 방향으로만 의존성을 가집니다. 역방향 참조는 금지됩니다.
    </p>

    <div class="layer-diagram">
      <div
        v-for="item in LAYER_ITEMS"
        :key="item.name"
        :class="`layer-item layer-item${item.mod}`"
      >
        <span class="layer-item__id">{{ item.l }}</span>
        <span class="layer-item__name">{{ item.name }}</span>
        <span class="layer-item__arrow">→</span>
        <span class="layer-item__desc">{{ item.desc }}</span>
      </div>
    </div>
  </section>

  <!-- ── State Management ───────────────────────────────────────────────── -->
  <section id="state-management" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">⊞</span>상태 관리
    </h2>
    <DocsCallout type="warning">
      모든 전역 상태를 Pinia로 관리하지 마세요. 서버 상태는 useFetch/useAsyncData, 로컬 UI 상태는 ref를 우선 사용하세요.
    </DocsCallout>

    <div class="state-cards">
      <div
        v-for="card in STATE_CARDS"
        :key="card.tool"
        :class="`state-card state-card${card.mod}`"
      >
        <div class="state-card__scope">{{ card.scope }}</div>
        <div class="state-card__tool">{{ card.tool }}</div>
        <div class="state-card__desc">{{ card.desc }}</div>
      </div>
    </div>
  </section>

  <!-- ── Color Palette ──────────────────────────────────────────────────── -->
  <section id="color-palette" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">🎨</span>컬러 팔레트
    </h2>
    <p class="section__lead">
      모든 색상은 SCSS 변수와 CSS 커스텀 프로퍼티로 이중 정의됩니다.
      컴포넌트에서는 반드시 CSS 변수를 참조하고, 계산이 필요한 경우에만 SCSS 변수를 사용하세요.
    </p>

    <div class="palette-section">
      <div class="palette-section__label">시맨틱 컬러</div>
      <div class="semantic-grid">
        <div v-for="c in SEMANTIC_COLORS" :key="c.name" class="color-swatch">
          <div class="color-swatch__block" :style="{ background: c.hex }" />
          <div class="color-swatch__info">
            <div class="color-swatch__name">{{ c.name }}</div>
            <DocsCodeBadge :text="c.hex" />
            <div class="color-swatch__token">{{ c.token }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="palette in PALETTES" :key="palette.name" class="palette-section">
      <div class="palette-section__label">{{ palette.name }}</div>
      <div class="palette-strip">
        <div v-for="s in palette.shades" :key="s.shade" class="palette-strip__shade">
          <div class="palette-strip__shade-block" :style="{ background: s.hex }" />
          <div class="palette-strip__shade-tooltip">
            {{ s.shade }}
            <span>{{ s.hex }}</span>
          </div>
        </div>
      </div>
      <div class="palette-strip__labels">
        <span>50</span>
        <span>500</span>
        <span>900</span>
      </div>
    </div>
  </section>

  <!-- ── Typography ─────────────────────────────────────────────────────── -->
  <section id="typography" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">𝐓</span>타이포그래피
    </h2>

    <div class="font-cards">
      <div v-for="font in FONT_CARDS" :key="font.name" class="font-card">
        <div class="font-card__role">{{ font.role }}</div>
        <div class="font-card__name">{{ font.name }}</div>
        <div :class="['font-card__sample', { 'font-card__sample--mono': font.mono }]">
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
        <DocsCodeBadge :text="row.cls" />
        <span class="type-scale__size">{{ row.size }}</span>
        <span :style="{ fontSize: row.size, fontWeight: row.weight, color: 'var(--text)', lineHeight: '1.4' }">
          {{ row.sample }}
        </span>
      </div>
    </div>
  </section>

  <!-- ── Spacing & Grid ─────────────────────────────────────────────────── -->
  <section id="spacing-grid" class="section">
    <h2 class="section-heading">
      <span class="section-heading__icon">⊞</span>스페이싱 & 그리드
    </h2>
    <p class="section__lead">
      4px 기반 스케일. SCSS 변수 <DocsCodeBadge text="$space-4" />처럼 참조하거나
      CSS 변수로 직접 사용합니다.
    </p>

    <div class="spacing-scale">
      <div v-for="s in SPACING_SCALE" :key="s.name" class="spacing-scale__row">
        <span class="spacing-scale__name">{{ s.name }}</span>
        <div class="spacing-scale__bar" :style="{ width: s.px }" />
        <span class="spacing-scale__values">{{ s.px }} / {{ s.rem }}</span>
      </div>
    </div>

    <div class="palette-section__label" style="margin-bottom: 12px">그리드 시스템</div>
    <div class="grid-demo">
      <div v-for="i in 12" :key="i" class="grid-demo__col">{{ i }}</div>
    </div>
    <div class="grid-caption">12컬럼 그리드 — 기본 gap: 24px ($space-6)</div>
  </section>

  <!-- ── CSS Variables ──────────────────────────────────────────────────── -->
  <section id="css-variables" class="section">
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
  </section>

  <!-- ── Buttons ────────────────────────────────────────────────────────── -->
  <section id="buttons" class="section">
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
  </section>

  <!-- ── Form Elements ──────────────────────────────────────────────────── -->
  <section id="form-elements" class="section">
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
  </section>

  <!-- ── Cards & Panels ─────────────────────────────────────────────────── -->
  <section id="cards-panels" class="section">
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
  </section>

  <!-- ── Feedback ───────────────────────────────────────────────────────── -->
  <section id="feedback" class="section">
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
  </section>
</template>

<script setup lang="ts">
// ── Types ────────────────────────────────────────────────────────────────────
type FileItem = {
  type: 'dir' | 'file'
  name: string
  note?: string
  children?: FileItem[]
}

type FlatFileItem = Omit<FileItem, 'children'> & { depth: number }

// ── State ────────────────────────────────────────────────────────────────────
const copiedVar = ref<string | null>(null)
const activeTab = ref<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary')

// ── Static data ──────────────────────────────────────────────────────────────
const BUTTON_TABS = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const

const FEATURE_CARDS = [
  { icon: '⚡', label: '빠른 개발', desc: '공통 컴포넌트로 반복 작업 최소화' },
  { icon: '🗂', label: '레이어 구조', desc: '명확한 관심사 분리와 단방향 의존성 규칙' },
  { icon: '🎨', label: '디자인 토큰', desc: 'CSS 변수 기반의 일관된 스타일 시스템' },
]

const QUICK_START_CMDS = ['npx create-fw-app my-project', 'cd my-project', 'npm run dev']

const PALETTES = [
  {
    name: 'Primary — Violet',
    shades: [
      { shade: '50',  hex: '#F5F3FF' }, { shade: '100', hex: '#EDE9FE' },
      { shade: '200', hex: '#DDD6FE' }, { shade: '300', hex: '#C4B5FD' },
      { shade: '400', hex: '#A78BFA' }, { shade: '500', hex: '#8B5CF6' },
      { shade: '600', hex: '#7C3AED' }, { shade: '700', hex: '#6D28D9' },
      { shade: '800', hex: '#5B21B6' }, { shade: '900', hex: '#4C1D95' },
    ],
  },
  {
    name: 'Accent — Cyan',
    shades: [
      { shade: '50',  hex: '#ECFEFF' }, { shade: '100', hex: '#CFFAFE' },
      { shade: '200', hex: '#A5F3FC' }, { shade: '300', hex: '#67E8F9' },
      { shade: '400', hex: '#22D3EE' }, { shade: '500', hex: '#06B6D4' },
      { shade: '600', hex: '#0891B2' }, { shade: '700', hex: '#0E7490' },
      { shade: '800', hex: '#155E75' }, { shade: '900', hex: '#164E63' },
    ],
  },
  {
    name: 'Neutral — Slate',
    shades: [
      { shade: '50',  hex: '#F8FAFC' }, { shade: '100', hex: '#F1F5F9' },
      { shade: '200', hex: '#E2E8F0' }, { shade: '300', hex: '#CBD5E1' },
      { shade: '400', hex: '#94A3B8' }, { shade: '500', hex: '#64748B' },
      { shade: '600', hex: '#475569' }, { shade: '700', hex: '#334155' },
      { shade: '800', hex: '#1E293B' }, { shade: '900', hex: '#0F172A' },
    ],
  },
]

const SEMANTIC_COLORS = [
  { name: 'Success', hex: '#10B981', token: '--color-success' },
  { name: 'Warning', hex: '#F59E0B', token: '--color-warning' },
  { name: 'Error',   hex: '#EF4444', token: '--color-error' },
  { name: 'Info',    hex: '#06B6D4', token: '--color-accent' },
]

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
  { name: '2',  px: '8px',  rem: '0.5rem'  },
  { name: '3',  px: '12px', rem: '0.75rem' },
  { name: '4',  px: '16px', rem: '1rem'    },
  { name: '6',  px: '24px', rem: '1.5rem'  },
  { name: '8',  px: '32px', rem: '2rem'    },
  { name: '10', px: '40px', rem: '2.5rem'  },
  { name: '12', px: '48px', rem: '3rem'    },
  { name: '16', px: '64px', rem: '4rem'    },
  { name: '20', px: '80px', rem: '5rem'    },
  { name: '24', px: '96px', rem: '6rem'    },
]

const FILE_TREE_ITEMS: FileItem[] = [
  {
    type: 'dir', name: 'src/', children: [
      {
        type: 'dir', name: 'app/', note: '앱 엔트리 & 전역 설정',
        children: [
          { type: 'file', name: 'App.tsx',    note: '루트 컴포넌트' },
          { type: 'file', name: 'router.tsx', note: '라우트 정의' },
          { type: 'file', name: 'store.ts',   note: '전역 스토어 초기화' },
        ],
      },
      {
        type: 'dir', name: 'pages/', note: '라우트 페이지 컴포넌트',
        children: [
          { type: 'file', name: 'HomePage.tsx' },
          { type: 'file', name: 'DashboardPage.tsx' },
        ],
      },
      {
        type: 'dir', name: 'features/', note: '도메인별 기능 모듈',
        children: [
          {
            type: 'dir', name: 'auth/',
            children: [
              { type: 'file', name: 'AuthForm.tsx' },
              { type: 'file', name: 'useAuth.ts' },
              { type: 'file', name: 'auth.store.ts' },
            ],
          },
          { type: 'dir', name: 'dashboard/', children: [] },
        ],
      },
      {
        type: 'dir', name: 'components/', note: '공통 UI 컴포넌트',
        children: [
          { type: 'dir', name: 'ui/',     note: '원자 단위 컴포넌트' },
          { type: 'dir', name: 'layout/', note: '레이아웃 컴포넌트' },
        ],
      },
      {
        type: 'dir', name: 'hooks/', note: '공통 커스텀 훅',
        children: [
          { type: 'file', name: 'useMediaQuery.ts' },
          { type: 'file', name: 'useDebounce.ts' },
        ],
      },
      {
        type: 'dir', name: 'lib/', note: '유틸리티 & 서비스',
        children: [
          { type: 'file', name: 'api.ts',   note: 'HTTP 클라이언트' },
          { type: 'file', name: 'utils.ts' },
        ],
      },
      {
        type: 'dir', name: 'styles/', note: '전역 스타일',
        children: [
          { type: 'dir',  name: 'scss/',    note: 'Dart Sass 파티얼' },
          { type: 'file', name: 'fonts.css' },
        ],
      },
      { type: 'dir', name: 'types/', note: '전역 타입 정의' },
    ],
  },
  { type: 'file', name: 'package.json' },
  { type: 'file', name: 'tsconfig.json' },
  { type: 'file', name: 'vite.config.ts' },
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

const FONT_CARDS = [
  { role: 'Display / Body', name: 'Plus Jakarta Sans', sample: 'Aa Bb 가나다', weights: ['300', '400', '600', '700', '800'], mono: false },
  { role: 'Code / Label',   name: 'JetBrains Mono',   sample: 'const x = 1', weights: ['400', '500', '600'],               mono: true  },
]

const TYPE_SCALE = [
  { cls: 'text-4xl',  size: '36px', weight: '700', sample: 'Display Heading' },
  { cls: 'text-3xl',  size: '30px', weight: '700', sample: 'Hero Title' },
  { cls: 'text-2xl',  size: '24px', weight: '600', sample: 'Section Heading' },
  { cls: 'text-xl',   size: '20px', weight: '600', sample: 'Sub-heading' },
  { cls: 'text-lg',   size: '18px', weight: '600', sample: 'Large Body' },
  { cls: 'text-base', size: '16px', weight: '400', sample: '본문 텍스트입니다' },
  { cls: 'text-sm',   size: '14px', weight: '400', sample: '보조 설명 텍스트' },
  { cls: 'text-xs',   size: '12px', weight: '500', sample: 'Label / Caption' },
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

// ── File tree flatten ────────────────────────────────────────────────────────
function flattenTree(items: FileItem[], depth = 0): FlatFileItem[] {
  return items.flatMap((item) => [
    { type: item.type, name: item.name, note: item.note, depth },
    ...(item.children ? flattenTree(item.children, depth + 1) : []),
  ])
}

const flatFileTree = computed(() => flattenTree(FILE_TREE_ITEMS))

// ── Methods ──────────────────────────────────────────────────────────────────
const copyVar = (token: string) => {
  navigator.clipboard.writeText(token)
  copiedVar.value = token
  setTimeout(() => (copiedVar.value = null), 1500)
}

definePageMeta({
  layout: 'default'
})
</script>
