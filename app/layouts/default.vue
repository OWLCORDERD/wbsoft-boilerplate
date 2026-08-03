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
          <DOCSSidebarNav
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

      <!-- Left Sidebar -->
      <aside class="sidebar">
        <DOCSSidebarNav
          :active-section="activeSection"
          :expanded-groups="expandedGroups"
          @toggle-group="toggleGroup"
          @scroll-to="scrollTo"
        />
      </aside>

      <!-- Main Content (page slot) -->
      <main class="main">
        <!-- ── Topbar ──────────────────────────────────────────────────────── -->
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
            <button
              v-for="label in ['아이콘 디렉토리', '공통 UI 패키지', 'FSD 구조', '협업 워크스페이스']"
              :key="label"
              class="topbar__nav-link"
            >
              {{ label }}
            </button>
          </nav>

          <!-- <div class="topbar__actions">
            <div class="topbar__search">
              <span>🔍</span>
              <span>검색...</span>
              <kbd class="topbar__search-kbd">⌘K</kbd>
            </div>
            <a href="#" class="topbar__github">
              <span>⎇</span>
              <span>GitHub</span>
            </a>
          </div> -->
        </header>

        <div class="main__inner">
          <slot />
        </div>
      </main>

      <!-- Right TOC -->
      <!-- <aside class="toc">
        <div class="toc__community">
          <div class="toc__community-label">커뮤니티</div>
          <p class="toc__community-desc">내부 Slack #framework 채널에서 논의에 참여하세요.</p>
          <div class="toc__community-links">
            <button class="toc__community-link">⎇ GitHub</button>
            <button class="toc__community-link">↗ Discord</button>
          </div>
        </div>
      </aside> -->

    </div>
  </div>

  <WBToast />
</template>

<script setup lang="ts">
import gsap from 'gsap';

const mobileNavOpen = ref(false)
const activeSection = ref('introduction')
const expandedGroups = reactive<Record<string, boolean>>({
  '시작하기': true,
  '아키텍처': true,
  '디자인 시스템': true,
  '컴포넌트': false,
})

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    console.log(defaultColorSet);
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
