<template>
  <div class="docs"
  :style="{ '--colorMain': '#' + code,
    '--colorSub': codeDark,
    '--colorClear': codeClear,
    '--font': font,
   }">

    <!-- ── Mobile overlay ────────────────────────────────────────────────── -->
    <Transition name="mobile-overlay">
      <div v-if="mobileNavOpen" class="mobile-overlay">
        <div class="mobile-overlay__backdrop" @click="mobileNavOpen = false" />
        <aside class="mobile-overlay__panel">
          <div class="mobile-overlay__header">
            <span>Navigation</span>
            <button class="mobile-overlay__close" @click="mobileNavOpen = false">✕</button>
          </div>
          <!-- ── 모바일 사이드바 내비게이션 (Mobile Sidebar Navigation) ──────────────────────────────────────────────────────── -->
          <DOCSSidebarNav
            v-model="currentPathNavMenuList"
            :active-section="activeSection"
            :expanded-groups="expandedGroups"
            @toggle-group="toggleGroup"
            @scroll-to="scrollTo"
          />
        </aside>
      </div>
    </Transition>

    <!-- ── 3-column body ─────────────────────────────────────────────────── -->
    <div class="docs-body">

      <!-- 좌측 사이드바 (Sidebar) -->
      <aside class="sidebar">
        <DOCSSidebarNav
          v-model="currentPathNavMenuList"
          :active-section="activeSection"
          :expanded-groups="expandedGroups"
          @toggle-group="toggleGroup"
          @scroll-to="scrollTo"
        />
      </aside>

      <!-- Main Content (page slot) -->
      <main class="main">
        <!-- ── 상단 네비게이션 (Topbar) ──────────────────────────────────────────────────────── -->
        <header class="topbar">
          <div class="topbar__left">
            <button class="topbar__mobile-menu" @click="mobileNavOpen = true">☰</button>
            <div class="topbar__logo">
              <div class="topbar__logo-mark">WB</div>
              <span class="topbar__logo-name">Boilerplate</span>
              <span class="topbar__logo-version">v1.0</span>
            </div>
          </div>

          <nav class="topbar__nav">
            <a
              v-for="menu in topbarMenu"
              :key="menu.id"
              class="topbar__nav-link"
              :href="menu.href"
            >
              {{ menu.label }}
            </a>
          </nav>
        </header>

        <div class="main__inner">
          <slot />
        </div>
      </main>

      <!-- 우측 사이드바 TOC (Right TOC) -->
      <aside class="toc">
        <div class="toc__community">
          <div class="toc__community-label">커뮤니티</div>
          <p class="toc__community-desc">프론트 협업 워크스페이스 참여하기</p>
          <div class="toc__community-links">
            <a target="_blank" href="https://app.notion.com/p/owlcoderd/24dd88bad98180bdae77faaa622abc9c" class="toc__community-link">⎇ Notion</a>
          </div>
        </div>
      </aside>

    </div>

    <V1Toast />
  </div>
</template>

<script setup lang="ts">
const mobileNavOpen = ref(false)
const activeSection = ref('introduction')
const expandedGroups = reactive<Record<string, boolean>>({
  '시작하기': true,
  '아키텍처': true,
  '디자인 시스템': true,
  '컴포넌트': false,
  '아이콘': true,
})

const topbarMenu = [
  {
    id: 1,
    label: '홈',
    href: '/',
  },
  {
    id: 2,
    label: '아이콘 디렉토리',
    href: '/icon',
  },
  {
    id: 3,
    label: '공통 UI 패키지',
    href: '/ui-package',
  },
  {
    id: 4,
    label: 'FSD 구조',
    href: '/fsd-structure',
  },
  {
    id: 5,
    label: '협업 워크스페이스',
    href: 'https://app.notion.com/p/owlcoderd/24dd88bad98180bdae77faaa622abc9c',
  },
]

export type NavGroup = { group: string; icon: string; items: NavItem[]; baseUrl: string; }

export type NavItem = { label: string; id: string }

const NAV: NavGroup[] = [
  {
    group: '시작하기',
    icon: '📖',
    items: [
      { label: '소개', id: 'introduction' },
      { label: '빠른 시작', id: 'quick-start' },
    ],
    baseUrl: '/',
  },
  {
    group: '아키텍처',
    icon: '🗂',
    items: [
      { label: '프로젝트 구조', id: 'project-structure' },
      // { label: '레이어 & 모듈', id: 'layers-modules' },
      { label: '상태 관리', id: 'state-management' },
    ],
    baseUrl: '/',
  },
  {
    group: '디자인 시스템',
    icon: '🎨',
    items: [
      { label: '컬러 팔레트', id: 'color-palette' },
      { label: '타이포그래피', id: 'typography' },
      { label: '스페이싱 & 그리드', id: 'spacing-grid' },
    ],
    baseUrl: '/',
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
    baseUrl: '/components',
  },
  {
    group: '아이콘',
    icon: '📂',
    items: [
      { label: '버튼 아이콘', id: '버튼 아이콘' },
      { label: '화살표 아이콘', id: '화살표 아이콘' },
      { label: '과정 상세 아이콘', id: '과정 상세 아이콘' },
      { label: '상세 정보 아이콘', id: '상세 정보 아이콘' },
      { label: '드래그 드롭 아이콘', id: '드래그 드롭 아이콘' },
      { label: '기타 아이콘', id: '기타 아이콘' },
      { label: '파일 확장자 아이콘', id: '파일 확장자 아이콘' },
      { label: '필터 아이콘', id: '필터 아이콘' },
      { label: '플로팅 버튼 아이콘', id: '플로팅 버튼 아이콘' },
      { label: 'GNB 네비게이션 아이콘', id: 'GNB 네비게이션 아이콘' },
      { label: '홈 설정 아이콘', id: '홈 설정 아이콘' },
      { label: '학습자 아이콘', id: '학습자 아이콘' },
      { label: '요금제 아이콘', id: '요금제 아이콘' },
      { label: '우선순위 아이콘', id: '우선순위 아이콘' },
      { label: '테이블 하위데이터 아이콘', id: '테이블 하위데이터 아이콘' },
      { label: '텍스트필드 아이콘', id: '텍스트필드 아이콘' },
    ],
    baseUrl: '/icon',
  }
]

const path = useRoute();

const currentPathNavMenuList = computed(() => {
  return NAV.filter((item) => item.baseUrl === path.fullPath);
});

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  mobileNavOpen.value = false
}

const toggleGroup = (group: string) => {
  expandedGroups[group] = !expandedGroups[group]
}

let sectionObserver: IntersectionObserver | null = null

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeSection.value = e.target.id
      })
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  document.querySelectorAll('section[id]').forEach((el) => sectionObserver!.observe(el))
})

onUnmounted(() => {
  sectionObserver?.disconnect()
})


// 2023.07.28[bnJung]: 색상테마 설정 - default: 4a509f
const { $homepage } = useNuxtApp();
const {
  colorCode: code,
  font,
  colorType: type,
  defaultColorSet,
  themeColorSelector,
} = $homepage;

const codeRgb = computed(() => {
  const codeHex = code.value.match(/.{1,2}/g);

  return codeHex?.map((item) => {
    return parseInt(item, 16);
  });
});

// 2025.10.14[mhlim]: 기본 테마 선택 컬러 코드가 포함된 테마 객체 반환
const selectDefaultTheme = computed(() => {
  if (type.value === 'theme') {
    return defaultColorSet.filter((theme) => {
      if (Array.isArray(theme.color) && theme.color.includes(code.value)) {
        return theme;
      }
    })[0];
  }
});

// 사용자 지정 or 기본 테마 선택 컬러 코드에 따른 dark 컬러
const codeDark = computed(() => {
  if (type.value === 'user') {
    const code = codeRgb.value ? [
      codeRgb.value[0]! - 28,
      codeRgb.value[1]! - 29,
      codeRgb.value[2]! - 49,
    ] : [];
    const formatCode: number[] = [];

    formatRgb(code, formatCode);

    console.log(formatCode);

    return 'rgb(' + formatCode.join(',') + ')';
  } else {
    return `#${selectDefaultTheme.value?.color[0]}`;
  }
});

// 사용자 지정 컬러 사용 시 light 컬러
const codeLight = computed(() => {
  if (type.value === 'user') {
    const code = codeRgb.value ? [
      codeRgb.value[0]! + 29,
      codeRgb.value[1]! + 28,
      codeRgb.value[2]! + 15,
    ] : [];
    const formatCode: number[] = [];

    formatRgb(code, formatCode);

    return 'rgba(' + formatCode.join(',') + ')';
  } else {
    return `#${selectDefaultTheme.value?.color[2]}`;
  }
});

const codeClear = computed(() => {
  if (type.value === 'user') {
    // code 변수에서 RGB 값을 추출
    const r = parseInt(code.value.substr(0, 2), 16);
    const g = parseInt(code.value.substr(2, 2), 16);
    const b = parseInt(code.value.substr(4, 2), 16);

    // RGB 값을 HSL로 변환
    return rgbToHsl(r, g, b);
  } else {
    return `#${selectDefaultTheme.value?.color[3]}`;
  }
});

// dark 또는 light로 계산 된 rgb값 min, max 체크 후 변경
const formatRgb = (item: number[], target: number[]) => {
  item.forEach((code: number) => {
    if (code < 0) {
      code = 0;
    } else if (code > 255) {
      code = 255;
    }

    target.push(code);
  });
};

// colorClear를 위한 이벤트
const rgbToHsl = (r: number, g: number, b: number, type?: string) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number | undefined,
    s: number | undefined,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // 그레이 스케일
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = h ? h / 6 : 0;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  // 2024.06.10[hrkim]: medium일 경우 colorClear 보다 10% 어둡게
  l = type === 'medium' ? 87.3 : 97;

  return `hsl(${h}, ${s}%, ${l}%)`;
};

</script>

<style lang="scss" scoped>
.mobile-overlay-enter-active,
.mobile-overlay-leave-active {
  transition: opacity 0.2s ease;
  .mobile-overlay__panel {
    transition: transform 0.2s ease;
  }
}
.mobile-overlay-enter-from,
.mobile-overlay-leave-to {
  opacity: 0;
  .mobile-overlay__panel {
    transform: translateX(-100%);
  }
}
</style>
