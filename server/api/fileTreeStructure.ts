import type { FileItem } from '~/components/structure/file-tree.vue';

export default defineEventHandler(async (event) => {
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
  ];

  if (event.req.method === 'GET') {
    return FILE_TREE_ITEMS;
  }
})
