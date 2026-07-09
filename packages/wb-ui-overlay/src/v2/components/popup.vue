<template>
  <transition name="fade">
    <ClientOnly>
      <div
        v-if="popupShow"
        class="modal layer-popup-v2"
        :class="{ 'is-show': popupShow }"
      >
        <!-- 클라이언트 사이드 import 라이브러리 컴포넌트 ref 바인딩 -->
        <component
          v-if="Vue3DraggableResizable"
          :key="draggableKey"
          :is="Vue3DraggableResizable"
          ref="draggableRef"
          :x="draggableData.x"
          :y="draggableData.y"
          :w="draggableData.w"
          :h="draggableData.h"
          :minW="draggableData.minW"
          :parent="true"
          :class="{ 'initial-height': isInitialHeight }"
          @resizing="handleResize"
        >
          <div class="modal-container">
            <div class="modal-header">
              <p v-if="!contTitle" class="title">{{ popupTitle }}</p>
              <div v-else id="popup-title" class="popup-title-slot" />
              <button type="button" class="btn-close" @click="close">
                <i class="icon" />
              </button>
            </div>

            <div class="modal-cont-wrap">
              <div class="modal-cont" ref="modalContentRef">
                <!-- 2025.11.06[mhlim]: 컨텐츠 영역 컴포넌트 동적 import -->
                <Suspense>
                  <template #default>
                    <component
                      :is="PopupContentComponent"
                      v-if="popupContentType && PopupContentComponent"
                      :model-value="propsData"
                    />
                  </template>
                  <!-- 컴포넌트 로딩 영역 렌더링 -->
                  <template #fallback>
                    <div class="loading-container">
                      <component
                        :is="Vue3Lottie"
                        v-if="Vue3Lottie"
                        animation-link="/assets/js/lottie/loading-spinner.json"
                        width="100"
                        height="100"
                        :loop="true"
                      />
                      <div v-else class="loading-fallback">Loading...</div>
                    </div>
                  </template>
                </Suspense>
              </div>
            </div>

            <!-- 레이어 팝업 푸터 (없는 경우 미노출)-->
            <div class="modal-footer" v-if="hasBtn">
              <component
                :is="PopupFooterComponent"
                v-if="popupContentType && PopupFooterComponent"
                v-model="propsData"
              />
            </div>

            <!-- 컨텐츠 영역에서 푸터 작성하고 teleport 시키는 경우 -->
            <div class="modal-footer" id="popup-footer" v-if="contBtn"></div>
          </div>
        </component>
      </div>
    </ClientOnly>
  </transition>
</template>

<script lang="ts" setup>
import {
  defineAsyncComponent,
  shallowRef,
  onMounted,
  onUnmounted,
  nextTick,
  type AsyncComponentLoader,
  type Component,
  type FunctionalComponent,
} from 'vue';
import { popupRegistry } from '../registry';
import type { PluginOptions } from 'vue3-lottie';
import { useWindowSize } from '@vueuse/core';

interface InitialPositionSizeType {
  x: number; // 초기 렌더링 x 배치 좌표
  y: number; // 초기 렌더링 y 배치 좌표
  w: number; // 초기 기본 팝업 너비 사이즈 (필수)
  h: number; // 초기 기본 팝업 높이 사이즈 (필수)
  minW: number; // 최소 너비 고정
  minH: number; // 최소 높이 고정
}

// SSR 호환을 위해 클라이언트 전용으로 import
const Vue3Lottie = shallowRef<PluginOptions | null>(null);
const Vue3DraggableResizable = shallowRef<any | null>(null);
const draggableKey = ref(0);

const {
  popupShow,
  popupTitle,
  popupContentType,
  propsData,
  hasBtn,
  contBtn,
  contTitle,
  close,
} = usePopupV2();
const currentRoute = useRoute();

const { width, height } = useWindowSize();

const draggableRef = ref(null);
// 모달 컨텐츠 높이 변화를 감지하기 위한 ref
const modalContentRef = ref(null);
const normalizePopupPosition = () => {
  const popupWidth = draggableData.value.w || 0;
  const popupHeight = draggableData.value.h || 0;

  draggableData.value.x = Math.max(
    0,
    Math.min(draggableData.value.x, width.value - popupWidth)
  );

  draggableData.value.y = Math.max(
    0,
    Math.min(draggableData.value.y, height.value - popupHeight)
  );
};
const draggableData = ref<InitialPositionSizeType>({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  minW: 200, // 200px 최소 너비 고정
  minH: 200, // 200px 최소 높이 고정
});

// 초기 렌더링 시 height 중앙고정여부
const isInitialHeight = ref(true);

const recenterPopup = () => {
  const vdrContainer = draggableRef.value?.$el;
  if (!vdrContainer || !isInitialHeight.value) {
    return;
  }

  const actualHeight = vdrContainer.offsetHeight;
  const maxHeight = height.value * 0.9;

  if (actualHeight > draggableData.value.minH) {
    const nextHeight = Math.min(actualHeight, maxHeight);

    draggableData.value.h = nextHeight;
    draggableData.value.y = Math.max((height.value - nextHeight) / 2, 0);

    if (actualHeight > maxHeight) {
      isInitialHeight.value = false;
    }
  }
};
const applyInitialPopupSize = async () => {
  if (!popupShow.value || !propsData.value?.initialSize) {
    return;
  }

  const { w, h } = propsData.value.initialSize;
  const centerX = (width.value - w) / 2;
  const centerY = (height.value - h) / 2;

  draggableData.value = {
    ...draggableData.value,
    x: centerX,
    y: centerY,
    w,
    h,
  };

  await nextTick();

  // height: initial이 적용된 경우 실제 렌더링된 높이로 y 좌표 재조정
  if (isInitialHeight.value) {
    setTimeout(recenterPopup, 100);
    setTimeout(recenterPopup, 300);
  }
};

watch(
  () => [
    popupShow.value,
    popupContentType.value,
    propsData.value?.initialSize?.w,
    propsData.value?.initialSize?.h,
  ],
  async (newVals, oldVals) => {
    // 팝업이 새로 열릴 때마다 초기 height 리셋
    if (popupShow.value) {
      isInitialHeight.value = true;
    }

    // 높이가 변경되면 다시 중앙정렬을 위해 isInitialHeight 리셋
    if (oldVals && newVals[3] !== oldVals[3] && popupShow.value) {
      isInitialHeight.value = true;
    }

    await applyInitialPopupSize();
  },
  { immediate: true }
);

watch(
  () => currentRoute.fullPath,
  () => {
    if (popupShow.value) {
      close();
    }
  }
);

// 2026.04.23[mhlim]: 컨텐츠 영역 그리드 생성 인스턴스 저장
const contentGrid = ref<GridInstance | null>(null);

// 2026.04.23[mhlim]: 그리드 생성 인스턴스 바인딩 상태값 자식 컴포넌트 공유
provide('contentGrid', contentGrid);

// 2026.04.23[mhlim]: 실시간 리사이징 값 반환 이벤트 핸들러
const handleResize = (data: any) => {
  // 사용자가 리사이즈를 시작하면 초기 height 고정 해제
  if (isInitialHeight.value) {
    isInitialHeight.value = false;
  }

  Object.assign(draggableData.value, data);
  if (contentGrid.value) {
    contentGrid.value.refreshLayout();
  }
};

// 2026.04.23[mhlim]: 팝업 레지스트리 merge 목록
// 현재 호출된 식별자의 팝업 레지스트리 조회
const currentPopupRegistry = computed(() => {
  return (
    popupRegistry[popupContentType.value as keyof typeof popupRegistry] ?? null
  );
});

const componentCache = {
  content: new Map<string, FunctionalComponent>(),
  footer: new Map<string, FunctionalComponent>(),
};

// 2025.11.04[mhlim]: 팝업 컨텐츠 타입 전달 받을 시
// -> 해당 식별자 매핑 컨텐츠 컴포넌트 동적 import 처리
const PopupContentComponent = computed(() => {
  if (!currentPopupRegistry.value || currentPopupRegistry.value === null) {
    return null;
  }

  // 현재 레지스트리 컨텐츠 컴포넌트 import문 조회
  const componentLoader: AsyncComponentLoader =
    currentPopupRegistry.value.content;

  if (componentCache.content.has(popupContentType.value)) {
    return componentCache.content.get(
      popupContentType.value
    ) as FunctionalComponent;
  }

  const component: FunctionalComponent = defineAsyncComponent(componentLoader);

  componentCache.content.set(popupContentType.value, component);

  return component as FunctionalComponent;
});

// 2025.11.04[mhlim]: 팝업 컨텐츠 타입 전달 받을 시
// -> 해당 식별자 매핑 버튼 영역 컴포넌트 동적 import 처리
const PopupFooterComponent = computed(() => {
  if (!currentPopupRegistry.value || currentPopupRegistry.value === null) {
    return null;
  }

  // 현재 레지스트리 버튼 영역 컴포넌트 import문 조회
  const componentLoader: AsyncComponentLoader =
    currentPopupRegistry.value.footer;

  if (!componentLoader) {
    return null;
  }

  if (componentCache.footer.has(popupContentType.value)) {
    return componentCache.footer.get(
      popupContentType.value
    ) as FunctionalComponent;
  }

  const component = defineAsyncComponent(
    componentLoader
  ) as FunctionalComponent;

  componentCache.footer.set(popupContentType.value, component);

  return component as FunctionalComponent;
});

onMounted(async () => {
  if (import.meta.client) {
    const { Vue3Lottie: LottieComponent } = await import('vue3-lottie');
    Vue3Lottie.value = LottieComponent;

    // 2026.04.28[mhlim]: 빌드 css 번들에 라이브러리 css 파일 import 처리
    await import('vue3-draggable-resizable/dist/Vue3DraggableResizable.css');
    const { default: DraggableComponent } =
      await import('vue3-draggable-resizable');
    Vue3DraggableResizable.value = DraggableComponent;

    // // 모달 컨텐츠 높이 변화 감지하여 자동 중앙정렬
    // if (modalContentRef.value && isInitialHeight.value) {
    //   const resizeObserver = new ResizeObserver(() => {
    //     if (isInitialHeight.value) {
    //       setTimeout(recenterPopup, 50);
    //     }
    //   });
    //   resizeObserver.observe(modalContentRef.value);

    //   onUnmounted(() => {
    //     resizeObserver.disconnect();
    //   });
    // }
  }
});

// 모달 컨텐츠 변화 감지 (watch 추가)
watch(
  () => modalContentRef.value,
  (newRef) => {
    if (newRef && isInitialHeight.value && import.meta.client) {
      const resizeObserver = new ResizeObserver(() => {
        if (isInitialHeight.value) {
          setTimeout(recenterPopup, 50);
        }
      });
      resizeObserver.observe(newRef);

      onUnmounted(() => {
        resizeObserver.disconnect();
      });
    }
  }
);

watch(
  () => [width.value, height.value],
  async () => {
    if (!popupShow.value) return;

    normalizePopupPosition();

    draggableKey.value += 1;

    await nextTick();

    recenterPopup();
    contentGrid.value?.refreshLayout?.();
  }
);
</script>

<style lang="scss" scoped>
@import '@/assets/scss/user/components/modal.scss';
@import '@/assets/scss/lxp/components/modal.scss';

:deep(.initial-height.vdr-container) {
  height: initial !important;
}
</style>
