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
import { usePopup } from '~/modules/layer-popup/runtime/composables/usePopup';
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
  'participant-detail': () =>
    import('~/components/lxp/modal/layer-popup/participant-detail.vue'),
  'write-warning-letter': () =>
    import('~/components/lxp/modal/layer-popup/write-warning-letter.vue'),

  'evaluation-result-report': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/grade-result/evaluation-result-report.vue'),
  'complete-survey-confirm': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/grade-result/complete-survey-confirm.vue'),
  'view-warning-letter': () =>
    import('~/components/lxp/modal/layer-popup/view-warning-letter.vue'),
  'instructor-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/instructor/approval-request.vue'),
  'instructor-external-payment-criteria': () =>
    import('~/components/lxp/modal/layer-popup/instructor/external-payment-criteria.vue'),
  'certificate-issue-target-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/target/detail.vue'),
  'certificate-issue-target-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/target/add.vue'),
  'certificate-issue-process-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/process/add.vue'),
  'training-template': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/process/training-template.vue'),
  'evaluation-classroom-simple-assignment': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/evaluation-classroom-simple-assignment.vue'),
  'schedule-view': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/schedule-view.vue'),
  'exam-supervisor-assignment': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/exam-supervisor-assignment/exam-supervisor-assignment.vue'),
  'exam-seat-layout': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/auditorium-seat-management/exam-seat-layout.vue'),
  'subject-add': () =>
    import('~/components/lxp/modal/layer-popup/subject-add.vue'),
  'view-lecture-performance-time': () =>
    import('~/components/lxp/modal/layer-popup/instructor/lecture-performance-time.vue'),
  'education-list': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/education-list.vue'),
  'change-reason-document': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/vocational-training/training-report/change-reason-document.vue'),
  'excluded-course-setup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/vocational-training/excluded-course-setup/index.vue'),
  'qr-code-view': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/vocational-training/qrcode-view/index.vue'),
  'process-status-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/process-status/detail.vue'),
  'request-approval': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/process-status/request-approval.vue'),
  'survey-item-add': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/survey-item-add.vue'),
  'enrollment-guidance': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/enrollment-guidance.vue'),
  'survey-period-change': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/survey-period-change.vue'),
  'subject-survey': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/subject-survey.vue'),
  'subject-survey-descriptive-all-view': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/subject-survey-descriptive-all-view.vue'),
  'upload-mobile-server': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/upload-mobile-server.vue'),
  'free-form-comments-process': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/free-comments-process.vue'),
  'free-comments': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/free-comments.vue'),
  'course-grade-registration': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/course-grade-registration.vue'),
  'bonus-reason-popup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/bonus-reason-popup.vue'),
  'completion-survey': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/completion-survey.vue'),
  'sample-file-download': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/sample-file-download.vue'),
  'learner-improvement': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/learner-improvement.vue'),
  'keyword-management': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/keyword-management.vue'),
  'execution-plan-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan-approval-request.vue'),
  'execution-plan-course-type': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan-course-type.vue'),
  'writing-plan-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/material/writing-plan-approval-request.vue'),
  'writing-plan-approval-progress': () =>
    import('~/components/lxp/modal/layer-popup/material/writing-plan-approval-progress.vue'),
  'personal-info-access': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/personal-info-access.vue'),
  'change-history-approval': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/change-history-approval.vue'),
  'information-change-history': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/information-change-history.vue'),
  'change-approval-status': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/change-approval-status.vue'),
  'execution-plan-change-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/execution-plan-change-approval-request.vue'),
  'add-round': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/add-round.vue'),
  'cancel-course-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/cancel-course-request.vue'),
  'schedule-change-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/schedule-change-request.vue'),
  'task-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan/task-detail.vue'),
  'course-kst': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan/course-kst.vue'),

  'version-update': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/version/version-update.vue'),

  'qr-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/qr-add.vue'),
  'qr-view': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/qr-view.vue'),
  'profile-image-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/profile-image-add.vue'),
  'profile-image-view': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/profile-image-view.vue'),
  'participant-popup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/participant-popup.vue'),
  'lecture-request-mail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/lecture-request-mail.vue'),
  'name-plate-popup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/name-plate-popup.vue'),
  'participant-popup-mail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/participant-popup-mail.vue'),
  'participant-popup-sms': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/participant-popup-sms.vue'),

  'payment-inquiry': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/payment-inquiry/index.vue'),
  'evidence-attachment': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/evidence-attachment.vue'),
  'detail-criteria-info': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/detail-criteria-info.vue'),
  'performance-management-detail-view': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/performance-management-detail-view.vue'),
  'payment-inquiry': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/payment-inquiry/index.vue'),
  'appeal-detail': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/appeal-detail.vue'),
  'preparation-management-print': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/preparation-management-print.vue'),
  certification: () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/certification.vue'),
  'annual-schedules': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/annual-schedules.vue'),
  'power-plant-integration': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan/power-plant-integration.vue'),
  'ttm-download': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/download.vue'),
  'time-table-print': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/weekly-schedule-status/time-table-print.vue'),
  'time-table-print-v2': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/weekly-schedule-status/time-table-print-v2.vue'),
  'single-time-table-print': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/single-time-table-print.vue'),
  'single-time-table-print-v2': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/single-time-table-print-v2.vue'),
  'survey-result-descriptive-all': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/descriptive-all.vue'),
  'writing-plan-report': () =>
    import('~/components/lxp/modal/layer-popup/material/writing-plan-report.vue'),
  'base-setting': () =>
    import('~/components/lxp/modal/layer-popup/education/statistics/target-management/base-setting.vue'),
  'consolidated-approval': () =>
    import('~/components/lxp/modal/layer-popup/consolidated-approval.vue'),
  'certificate-preview': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/preview.vue'),
};

const footerComponentMapping = {
  example: () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
  'write-warning-letter': () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
  'view-warning-letter': () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
  'instructor-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/instructor/approval-request-btn-wrap.vue'),

  'certificate-issue-target-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/certificate-issue/target/detail-btn.vue'),
  'certificate-issue-target-add': () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
  'certificate-issue-process-add': () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),
  'training-template': () =>
    import('~/components/lxp/modal/layer-popup/example/v1/btn-wrap.vue'),

  'evaluation-classroom-simple-assignment': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/evaluation-classroom-simple-assignment-btn-wrap.vue'),
  'exam-supervisor-assignment': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/exam-supervisor-assignment/exam-supervisor-assignment-btn-wrap.vue'),
  'exam-seat-layout': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/auditorium-seat-management/exam-seat-layout-btn-wrap.vue'),
  'course-grade-registration': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/course-grade-registration-btn-wrap.vue'),
  'bonus-reason-popup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/bonus-reason-popup-btn-wrap.vue'),
  // 'evaluation-date-input': () =>
  //   import(
  //     '~/components/lxp/modal/layer-popup/education/operation/course-progress/management/evaluation-date-input-btn-wrap.vue'
  //   ),
  'sample-file-download': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/management/sample-file-download-btn-wrap.vue'),
  'subject-add': () =>
    import('~/components/lxp/modal/layer-popup/subject-add-btn-wrap.vue'),
  'excluded-course-setup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/vocational-training/excluded-course-setup/btn-wrap.vue'),
  'process-status-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/process-status/detail-btn.vue'),
  'request-approval': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-completion/process-status/request-approval-btn.vue'),
  'survey-item-add': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/survey-item-add-btn-wrap.vue'),
  'execution-plan-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan-approval-request-btn-wrap.vue'),
  'execution-plan-course-type': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan-course-type-btn-wrap.vue'),
  'writing-plan-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/material/writing-plan-approval-request-btn-wrap.vue'),
  'personal-info-access': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/personal-info-access-btn-wrap.vue'),
  // 'official-id-search': () =>
  //   import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/official-id-search-btn-wrap.vue'),
  'change-history-approval': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-progress/evaluation-room-assignment/change-history-approval-btn-wrap.vue'),
  'execution-plan-change-approval-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/execution-plan-change-approval-request-btn-wrap.vue'),
  'add-round': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/add-round-btn-wrap.vue'),
  'cancel-course-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/cancel-course-request-btn-wrap.vue'),
  'schedule-change-request': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-opening/change-management/schedule-change-request-btn-wrap.vue'),
  'task-detail': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan/task-detail-btn-wrap.vue'),
  'course-kst': () =>
    import('~/components/lxp/modal/layer-popup/education/execution-plan/course-kst-btn-wrap.vue'),

  'profile-image-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/profile-image-add-btn-wrap.vue'),
  'qr-add': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/qr-add-btn-wrap.vue'),
  'name-plate-popup': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/name-plate-popup-btn-wrap.vue'),

  'version-update': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/version/btn-wrap.vue'),

  'evidence-attachment': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/evidence-attachment-btn-wrap.vue'),
  'detail-criteria-info': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/detail-criteria-info-btn-wrap.vue'),
  'version-update': () =>
    import('~/components/lxp/modal/layer-popup/education/plan/ttm/version/btn-wrap.vue'),

  'upload-mobile-server': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/upload-mobile-server-btn-wrap.vue'),
  'survey-period-change': () =>
    import('~/components/lxp/modal/layer-popup/education/satisfaction-survey/course-survey-result/survey-period-change-btn-wrap.vue'),
  'appeal-detail': () =>
    import('~/components/lxp/modal/layer-popup/evaluation/appeal-detail-btn-wrap.vue'),
  'base-setting': () =>
    import('~/components/lxp/modal/layer-popup/education/statistics/target-management/base-setting-btn-wrap.vue'),
  'preparation-management-print': () =>
    import('~/components/lxp/modal/layer-popup/education/operation/course-preparation/preparation-management-print-btn-wrap.vue'),
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
