<template>
  <transition name="fade">
    <div
      v-if="popupShow"
      class="modal layer-popup"
      :class="{ 'is-show': popupShow }"
    >
      <div class="modal-container" :class="popupContentType">
        <div class="modal-header">
          <p class="title">{{ popupTitle }}</p>
          <button type="button" class="btn-close" @click="close">
            <i class="icon" />
          </button>
        </div>

        <div class="modal-cont">
          <!-- 2025.11.06[mhlim]: 컨텐츠 영역 컴포넌트 동적 import -->
          <Suspense>
            <template #default>
              <component
                :is="PopupContentComponent"
                v-if="popupContentType && PopupContentComponent"
                v-model="propsData"
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

        <!-- 레이어 팝업 푸터 (없는 경우 미노출)-->
        <div class="modal-footer" v-if="hasBtn">
          <component
            :is="PopupFooterComponent"
            v-if="popupContentType && PopupFooterComponent"
            v-model="propsData"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { usePopup } from '../composables/usePopup';
import { defineAsyncComponent, shallowRef, onMounted } from 'vue';

// SSR 호환을 위해 클라이언트 전용으로 import
const Vue3Lottie = shallowRef(null);

onMounted(async () => {
  if (import.meta.client) {
    const { Vue3Lottie: LottieComponent } = await import('vue3-lottie');
    Vue3Lottie.value = LottieComponent;
  }
});

const { popupShow, popupTitle, popupContentType, propsData, hasBtn, close } =
  usePopup();

// 2025.11.04[mhlim]: 컨텐츠 영역 컴포넌트 매핑 객체 (popupContentType 식별자)
const contentComponentMapping = {
  example: () =>
    import('~/components/lxp/modal/layer-popup/example/v1/index.vue'),
};

const footerComponentMapping = {
  example: () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
};

// 2025.11.04[mhlim]: 팝업 컨텐츠 타입 전달 받을 시
// -> 해당 식별자 매핑 컨텐츠 컴포넌트 동적 import 처리
const PopupContentComponent = computed(() => {
  if (!popupContentType.value || popupContentType.value === '') {
    return null;
  }

  const componentLoader = contentComponentMapping[popupContentType.value];
  if (!componentLoader) {
    return null;
  }

  return defineAsyncComponent(componentLoader);
});

// 2025.11.04[mhlim]: 팝업 컨텐츠 타입 전달 받을 시
// -> 해당 식별자 매핑 버튼 영역 컴포넌트 동적 import 처리
const PopupFooterComponent = computed(() => {
  if (!popupContentType.value || popupContentType.value === '') {
    return null;
  }

  // console.log(footerComponentMapping[popupContentType.value]);

  const componentLoader = footerComponentMapping[popupContentType.value];
  if (!componentLoader) {
    return null;
  }

  return defineAsyncComponent(componentLoader);
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/lxp/components/modal.scss';
</style>
