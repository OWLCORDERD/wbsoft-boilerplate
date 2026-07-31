interface FileItem {
  type: 'dir' | 'file'
  name: string
  note?: string
  children?: FileItem[]
}

export default defineEventHandler(async (event) => {
  const FILE_TREE_ITEMS: FileItem[] = [
    // ── Nuxt 4 app/ 디렉토리 ──────────────────────────────────────────────────
    {
      type: 'dir', name: 'app/', note: 'Nuxt 4 메인 앱 라우터',
      children: [
        { type: 'file', name: 'app.vue',        note: '메인 앱 컴포넌트' },
        { type: 'file', name: 'app.config.ts',  note: '런타임 앱 설정' },
        { type: 'file', name: 'error.vue',       note: '전역 에러 페이지 (404, 500)' },
        {
          type: 'dir', name: 'assets/', note: '정적 자원 폴더 (빌드 처리)',
          children: [
            {
              type: 'dir', name: 'common/styles/base/', note: '디자인 시스템 SCSS',
              children: [
                { type: 'file', name: '_tokens.scss',     note: 'SCSS 변수 + CSS Custom Properties' },
                { type: 'file', name: '_mixins.scss',     note: '재사용 mixin 함수' },
                { type: 'file', name: '_base.scss',       note: 'Reset + 루트 엘리먼트' },
                { type: 'file', name: '_typography.scss', note: '텍스트 클래스' },
                { type: 'file', name: '_layout.scss',     note: '페이지 구조 클래스' },
                { type: 'file', name: '_nav.scss',        note: '사이드바 내비게이션' },
                { type: 'file', name: '_components.scss', note: '공통 UI 컴포넌트' },
                { type: 'file', name: '_docs.scss',       note: '가이드 문서 전용 블록' },
                { type: 'file', name: 'main.scss',        note: 'additionalData 전용 엔트리 (@forward)' },
                { type: 'file', name: 'global.scss',      note: 'CSS 전역 출력 엔트리 (css 배열)' },
              ],
            },
            {
              type: 'dir', name: 'lxp/styles/', note: 'LXP 전용 SCSS',
              children: [
                { type: 'file', name: '_layout.scss', note: 'LXP 레이아웃' },
                { type: 'file', name: 'agGrid.scss',  note: 'AG Grid 테마 오버라이드' },
              ],
            },
          ],
        },
        {
          type: 'dir', name: 'components/', note: '공통 UI 컴포넌트 (자동 import)',
          children: [
            { type: 'dir', name: 'docs/',      note: '가이드 문서 컴포넌트 → wb-ui-layout 패키지로 이관' },
            { type: 'dir', name: 'structure/', note: '구조 시각화 컴포넌트' },
          ],
        },
        { type: 'dir', name: 'composables/', note: '컴포넌트 범위 공통 컴포저블' },
        // ── FSD feature 레이어 ─────────────────────────────────────────────────
        {
          type: 'dir', name: 'features/', note: 'FSD — 도메인 기능 모듈',
          children: [
            {
              type: 'dir', name: 'agGrid/', note: 'AG Grid 그리드 피처',
              children: [
                { type: 'dir',  name: 'composables/', note: 'useAgGrid, useGridApi' },
                { type: 'dir',  name: 'renderers/',   note: '커스텀 셀 렌더러' },
                { type: 'dir',  name: 'types/',       note: '그리드 타입 정의' },
                { type: 'dir',  name: 'ui/v1/',       note: 'AgGrid.vue, index.vue (ClientOnly)' },
                { type: 'file', name: 'index.ts',     note: '피처 퍼블릭 API' },
              ],
            },
            {
              type: 'dir', name: 'tuiGrid/', note: 'Toast UI Grid 피처',
              children: [
                { type: 'dir',  name: 'composables/', note: 'useAgGrid, useGridApi' },
                { type: 'dir',  name: 'renderers/' },
                { type: 'dir',  name: 'types/' },
                { type: 'dir',  name: 'ui/v1/',   note: 'TuiGrid.vue' },
                { type: 'file', name: 'index.ts', note: '피처 퍼블릭 API' },
                { type: 'file', name: 'index.vue' },
              ],
            },
          ],
        },
        {
          type: 'dir', name: 'layouts/', note: 'Nuxt 레이아웃',
          children: [
            { type: 'file', name: 'default.vue', note: '기본 레이아웃' },
            { type: 'file', name: 'lxp.vue',     note: 'LXP 서비스 레이아웃' },
          ],
        },
        { type: 'dir', name: 'middleware/', note: 'Nuxt 라우트 미들웨어' },
        {
          type: 'dir', name: 'pages/', note: 'Nuxt 파일 기반 라우팅',
          children: [
            { type: 'file', name: 'index.vue',        note: '가이드 메인 페이지' },
            { type: 'dir',  name: 'lxp/',             note: 'LXP 서비스 페이지' },
            { type: 'dir',  name: 'regist-memo/[id]', note: '동적 라우트 페이지' },
          ],
        },
        {
          type: 'dir', name: 'plugins/', note: 'Nuxt 플러그인',
          children: [
            { type: 'file', name: '01.auth.js' },
            { type: 'file', name: '02.i18n.js' },
            { type: 'file', name: 'eventBus.js' },
          ],
        },
        // ── FSD shared 레이어 (app 범위) ───────────────────────────────────────
        { type: 'dir', name: 'shared/', note: 'FSD — app 범위 공유 유틸리티' },
      ],
    },
    // ── Nuxt 레이어 ────────────────────────────────────────────────────────────
    { type: 'dir', name: 'layers/', note: 'Nuxt 확장 레이어' },
    // ── Nuxt 로컬 모듈 ─────────────────────────────────────────────────────────
    {
      type: 'dir', name: 'modules/', note: 'Nuxt 로컬 모듈',
      children: [
        { type: 'file', name: 'overlay-bridge.ts', note: 'wb-ui-overlay 패키지 브릿지' },
      ],
    },
    // ── 워크스페이스 패키지 ────────────────────────────────────────────────────
    {
      type: 'dir', name: 'packages/', note: 'Yarn 워크스페이스 내부 패키지',
      children: [
        {
          type: 'dir', name: 'wb-ui-layout/', note: 'Nuxt 레이어 — 레이아웃 & 가이드 컴포넌트',
          children: [
            {
              type: 'dir', name: 'src/docs/', note: '가이드 문서 컴포넌트',
              children: [
                { type: 'file', name: 'section.vue',    note: '문단 슬롯 래퍼' },
                { type: 'file', name: 'sidebarNav.vue', note: '사이드바 내비게이션' },
                { type: 'dir',  name: 'ui/',            note: 'callout.vue, codeBadge.vue' },
                { type: 'dir',  name: 'getting-started/', note: 'feature-grid.vue, terminal.vue' },
                { type: 'dir',  name: 'architecture/',  note: 'file-tree.vue, layer-diagram.vue, state-cards.vue' },
              ],
            },
            { type: 'dir',  name: 'src/lxp/', note: 'LxpNavigation.vue' },
            { type: 'file', name: 'src/module.ts', note: 'Nuxt 레이어 모듈 엔트리' },
          ],
        },
        {
          type: 'dir', name: 'wb-ui-overlay/', note: 'Nuxt 모듈 — 오버레이 런타임',
          children: [
            { type: 'dir',  name: 'src/v1/', note: 'alert / confirm / popup / toast + composables' },
            { type: 'dir',  name: 'src/v2/', note: 'popup (registry 기반)' },
            { type: 'file', name: 'src/module.ts', note: 'Nuxt 모듈 엔트리' },
          ],
        },
      ],
    },
    // ── Nitro 서버 ─────────────────────────────────────────────────────────────
    {
      type: 'dir', name: 'server/', note: 'Nitro 서버 (SSR / API)',
      children: [
        {
          type: 'dir', name: 'api/', note: 'REST API 핸들러',
          children: [
            { type: 'file', name: 'fileTreeStructure.ts', note: '가이드 파일 트리 데이터' },
            { type: 'file', name: 'menuList.ts' },
            { type: 'file', name: 'checkList.ts' },
            { type: 'file', name: 'addSchedule.ts' },
          ],
        },
        { type: 'file', name: 'firestore.ts', note: 'Firebase 초기화' },
      ],
    },
    // ── FSD shared 레이어 (루트 범위) ──────────────────────────────────────────
    {
      type: 'dir', name: 'shared/', note: 'FSD — 프로젝트 전역 공유 레이어',
      children: [
        {
          type: 'dir', name: 'lib/composables/', note: '전역 컴포저블',
          children: [
            { type: 'file', name: 'useWbFetch.ts', note: '공통 HTTP 요청 컴포저블' },
          ],
        },
        { type: 'dir', name: 'types/',  note: '전역 타입 정의' },
        { type: 'dir', name: 'utils/',  note: '순수 유틸리티 함수' },
      ],
    },
    // ── 루트 설정 파일 ─────────────────────────────────────────────────────────
    { type: 'file', name: 'nuxt.config.ts', note: 'Nuxt 설정 (Vite / SCSS / 모듈)' },
    { type: 'file', name: 'package.json',   note: 'Yarn 워크스페이스 루트' },
    { type: 'file', name: 'tsconfig.json' },
  ];

  if (event.req.method === 'GET') {
    return FILE_TREE_ITEMS;
  }
})
