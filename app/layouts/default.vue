<template>
  <div class="docs">

    <!-- ── Topbar ──────────────────────────────────────────────────────── -->
    <header class="topbar">
      <div class="topbar__left">
        <button class="topbar__mobile-menu" @click="mobileNavOpen = true">☰</button>
        <div class="topbar__logo">
          <div class="topbar__logo-mark">FW</div>
          <span class="topbar__logo-name">FrameWork</span>
          <span class="topbar__logo-version">v2.0</span>
        </div>
      </div>

      <nav class="topbar__nav">
        <button
          v-for="label in ['가이드', '구조', '컴포넌트', 'API', '배포', '커뮤니티']"
          :key="label"
          class="topbar__nav-link"
        >
          {{ label }}
        </button>
      </nav>

      <div class="topbar__actions">
        <div class="topbar__search">
          <span>🔍</span>
          <span>검색...</span>
          <kbd class="topbar__search-kbd">⌘K</kbd>
        </div>
        <a href="#" class="topbar__github">
          <span>⎇</span>
          <span>GitHub</span>
        </a>
      </div>
    </header>

    <!-- ── Mobile overlay ────────────────────────────────────────────────── -->
    <Transition name="mobile-overlay">
      <div v-if="mobileNavOpen" class="mobile-overlay">
        <div class="mobile-overlay__backdrop" @click="mobileNavOpen = false" />
        <aside class="mobile-overlay__panel">
          <div class="mobile-overlay__header">
            <span>Navigation</span>
            <button class="mobile-overlay__close" @click="mobileNavOpen = false">✕</button>
          </div>
          <DocsSidebarNav
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
        <DocsSidebarNav
          :active-section="activeSection"
          :expanded-groups="expandedGroups"
          @toggle-group="toggleGroup"
          @scroll-to="scrollTo"
        />
      </aside>

      <!-- Main Content (page slot) -->
      <main class="main">
        <div class="main__inner">
          <slot />
        </div>
      </main>

      <!-- Right TOC -->
      <aside class="toc">
        <div class="toc__title">On this page</div>
        <ul class="toc__list">
          <li
            v-for="item in TOC_ITEMS"
            :key="item.id"
            :class="['toc__item', { 'toc__item--active': activeSection === item.id }]"
          >
            <button @click="scrollTo(item.id)">{{ item.label }}</button>
          </li>
        </ul>

        <div class="toc__community">
          <div class="toc__community-label">커뮤니티</div>
          <p class="toc__community-desc">내부 Slack #framework 채널에서 논의에 참여하세요.</p>
          <div class="toc__community-links">
            <button class="toc__community-link">⎇ GitHub</button>
            <button class="toc__community-link">↗ Discord</button>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup lang="ts">
const TOC_ITEMS = [
  { label: '소개', id: 'introduction' },
  { label: '프로젝트 구조', id: 'project-structure' },
  { label: '레이어 & 모듈', id: 'layers-modules' },
  { label: '컬러 팔레트', id: 'color-palette' },
  { label: '타이포그래피', id: 'typography' },
  { label: '스페이싱 & 그리드', id: 'spacing-grid' },
  { label: 'CSS 변수 레퍼런스', id: 'css-variables' },
  { label: '컴포넌트 가이드', id: 'buttons' },
]

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
