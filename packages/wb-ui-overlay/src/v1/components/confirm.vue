<template>
  <transition name="fade">
    <div
      class="modal modal-alert"
      v-if="confirmShow"
      :class="[surveyClass, { 'is-show': confirmShow }]"
      style="z-index: 10000"
    >
      <div
        class="modal-container type02 is-alert excel-upload-modal"
        :style="{ maxWidth: containerWidth }"
      >
        <!-- 헤더 영역 -->
        <div
          class="modal-header"
          :style="{
            paddingBottom: hasTable
              ? '20px'
              : !subMsg || subMsg === ''
                ? '40px'
                : '20px',
          }"
        >
          <button type="button" class="btn-close" @click="close" />
          <i class="fi-bulb" />
          <template v-if="hasTitle">
            <div class="title-label" v-if="hasTitleLabel">
              <span class="label">
                {{ displayName(labelTitle) }}
              </span>
              <p class="title" v-html="message"></p>
            </div>
            <p
              class="title"
              v-html="message"
              :style="{ wordBreak: containerWidth ? 'keep-all' : 'normal' }"
              v-else
            ></p>
          </template>
        </div>
        <!-- // 헤더 영역 -->
        <!-- 2025.10.20[njlee]: border 추가   -->
        <div
          class="modal-cont"
          v-if="(subMsg && subMsg !== '') || hasBorder || hasTable || hasRadio"
          :class="{ 'table-scroll': tableScrollYn }"
        >
          <p v-html="subMsg" v-if="subMsg"></p>

          <!-- 기존 hasBorder: 체크 아이콘 + 텍스트 리스트 -->
          <div
            class="modal-cont-border"
            v-if="hasBorder && !hasTable && !hasRadio"
          >
            <p v-html="subTitle" v-if="subTitle"></p>
            <ul v-if="confirmSubTexts && confirmSubTexts.length > 0">
              <li v-for="item in confirmSubTexts" :key="item">
                <div class="border-item">
                  <div class="check-icon">
                    <component
                      v-if="getSubTextIconComponent(item)"
                      :is="getSubTextIconComponent(item)"
                      :filled="item.filled !== false"
                      :style="{
                        width: item.iconSize || '16px',
                        height: item.iconSize || '16px',
                      }"
                    />
                  </div>
                  <p v-html="item.text" :title="item.text"></p>
                </div>
              </li>
            </ul>
          </div>

          <!-- hasRadio: 라디오 버튼 리스트 -->
          <div class="modal-cont-border" v-if="hasRadio">
            <p v-html="subTitle" v-if="subTitle"></p>
            <div
              class="check-wrap"
              v-if="radioOptions && radioOptions.length > 0"
            >
              <ul class="check-list">
                <li
                  class="check-list-item"
                  v-for="(option, index) in radioOptions"
                  :key="option.value"
                >
                  <div class="check-item">
                    <input
                      :id="`confirm-radio-${index}`"
                      type="radio"
                      name="confirm-radio-group"
                      :value="option.value"
                      v-model="selectedRadio"
                    />
                    <label :for="`confirm-radio-${index}`">
                      <span class="check-item-icon">
                        <svgo-common-radio-circle class="icon" filled />
                      </span>
                      <span class="check-item-txt" v-html="option.label"></span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- hasTable: 테이블만 표시 (border 없이) -->
          <div class="modal-cont-table" v-if="hasTable">
            <table class="default" v-if="tableData && tableData.length > 0">
              <colgroup>
                <col
                  v-for="(colWidth, colIndex) in getColumnWidths(tableData)"
                  :key="colIndex"
                  :style="{ width: colWidth || 'auto' }"
                />
              </colgroup>
              <tbody>
                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                  <td
                    v-for="(column, colIndex) in row.columns"
                    :key="colIndex"
                    :class="getColumnAlign(row, colIndex)"
                  >
                    <!-- 각 컬럼의 아이템들을 렌더링 -->
                    <div class="table-cell-content">
                      <template
                        v-for="(item, itemIndex) in column"
                        :key="itemIndex"
                      >
                        <!-- icon-text 타입 -->
                        <div
                          v-if="item.type === 'icon-text'"
                          class="table-cell-icon-text"
                        >
                          <component
                            v-if="getItemIconComponent(item)"
                            :is="getItemIconComponent(item)"
                            :filled="item.filled !== false"
                            :style="{
                              width: item.iconSize || '16px',
                              height: item.iconSize || '16px',
                            }"
                          />
                          <span v-html="item.text"></span>
                        </div>
                        <!-- text 타입 (색상 적용 가능) -->
                        <span
                          v-else-if="item.type === 'text'"
                          class="table-cell-text"
                          :style="getTextStyle(item)"
                        >
                          <span v-html="item.text"></span>
                        </span>
                        <!-- pill 타입 -->
                        <span
                          v-else
                          class="table-cell-pill"
                          :class="getPillType(item)"
                        >
                          <component
                            v-if="getItemIconComponent(item)"
                            :is="getItemIconComponent(item)"
                            class="pill-icon"
                            :style="getPillIconStyle(item)"
                          />
                          <span v-html="item.text"></span>
                        </span>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 푸터 영역 -->
        <div class="modal-footer">
          <div class="btn-wrap">
            <div class="btn-group">
              <button
                v-if="hasCancel"
                type="button"
                class="btn-gray"
                @click="cancel"
              >
                {{ cancelText }}
              </button>
              <button type="button" class="btn-main" @click="confirm">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
        <!-- // 푸터 영역 -->
      </div>
    </div>
  </transition>
</template>
<script setup>
import { useConfirm } from '~/modules/confirm/runtime/composables/useConfirm.js';

const {
  confirmShow,
  message,
  subMsg,
  subTitle,
  cancel,
  confirm,
  close,
  confirmText,
  cancelText,
  hasTitle,
  hasBorder,
  confirmSubTexts,
  hasTable,
  tableData,
  hasCancel,
  hasTitleLabel,
  labelTitle,
  containerWidth,
  tableScrollYn,
  surveyClass,
  hasRadio,
  radioOptions,
  selectedRadio,
} = useConfirm();

// subTexts 아이콘 컴포넌트 가져오기
const getSubTextIconComponent = (item) => {
  if (!item) return null;

  // 명시적으로 아이콘이 지정된 경우
  if (item.icon) {
    const componentName = `svgo-${item.icon}`;
    try {
      return resolveComponent(componentName);
    } catch (e) {
      console.warn(`Icon component not found: ${componentName}`);
      // 아이콘을 찾지 못하면 기본 아이콘 사용
      return resolveComponent('svgo-common-check-wheel-icon');
    }
  }

  // 기본 아이콘 (아이콘이 지정되지 않은 경우)
  return resolveComponent('svgo-common-check-wheel-icon');
};

// 아이템 아이콘 컴포넌트 가져오기 (hasBorder처럼 svgo 컴포넌트 사용)
const getItemIconComponent = (item) => {
  if (!item) return null;

  // 아이콘 이름 결정
  let iconName = null;

  // 명시적으로 아이콘이 지정된 경우
  if (item.icon) {
    iconName = item.icon;
  } else {
    // 타입에 따라 기본 아이콘 자동 적용
    const defaultIcons = {
      'icon-text': 'common-check-wheel-icon', // 체크 아이콘 (기본값)
      'pill-error': 'priority-warning', // 경고 아이콘 (불일치)
      'pill-warning': 'priority-warning', // 경고 아이콘
      'pill-success': 'common-check-wheel-icon', // 체크 아이콘
    };
    iconName = defaultIcons[item.type];
  }

  if (!iconName) return null;

  // svgo 컴포넌트 이름으로 변환 (예: 'common-check-wheel-icon' -> 'svgo-common-check-wheel-icon')
  const componentName = `svgo-${iconName}`;

  // resolveComponent를 사용하여 동적으로 컴포넌트 가져오기
  try {
    return resolveComponent(componentName);
  } catch (e) {
    console.warn(`Icon component not found: ${componentName}`);
    return null;
  }
};

const displayName = (labelTitle) => {
  switch (labelTitle) {
    case 'BEHAVIORAL_INDICATOR':
      return '행동지표';
    case 'TASK':
      return 'Task';
    case 'KST':
      return 'K/S/T';
    case 'LEARNING_OBJECT':
      return '학습목표';
    case 'DETAIL_LEARNING_OBJECT':
      return '세부학습목표';
  }
};

// Pill 타입 가져오기
const getPillType = (item) => {
  return item.type || 'pill-error';
};

// 컬럼 정렬 가져오기 (row에 align 속성이 있으면 사용)
const getColumnAlign = (row, colIndex) => {
  if (row.align && row.align[colIndex]) {
    return row.align[colIndex];
  }
  return 'left'; // 기본값
};

// 컬럼 너비 가져오기 (row에 width 속성이 있으면 사용, 없으면 자동)
const getColumnWidths = (tableData) => {
  if (!tableData || tableData.length === 0) return [];

  // 첫 번째 행의 컬럼 개수 확인
  const columnCount = tableData[0]?.columns?.length || 0;
  const widths = [];

  // 각 행에서 width 정보 수집
  for (let i = 0; i < columnCount; i++) {
    // 첫 번째 행에서 width 정보 확인
    const firstRowWidth = tableData[0]?.widths?.[i];
    if (firstRowWidth) {
      widths.push(firstRowWidth);
    } else {
      widths.push('auto'); // width가 없으면 자동
    }
  }

  return widths;
};

// Pill 아이콘 스타일 가져오기 (priority-warning은 빨간색)
const getPillIconStyle = (item) => {
  if (item.type === 'pill-error' || item.type === 'pill-warning') {
    // priority-warning 아이콘은 빨간색으로 표시
    return {
      color: '#FF3B30',
      fill: '#FF3B30',
    };
  }
  return {};
};

// Text 타입 스타일 가져오기 (색상 적용 가능)
const getTextStyle = (item) => {
  const style = {};
  if (item.color) {
    style.color = item.color;
  }
  if (item.fontSize) {
    style.fontSize = item.fontSize;
  }
  if (item.fontWeight) {
    style.fontWeight = item.fontWeight;
  }
  return style;
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/lxp/components/modal.scss';

.modal {
  &-container {
    &.type02 {
      .modal-header {
        .title {
          &::v-deep(span) {
            &.main-color {
              color: var(--colorMain);
            }
          }
        }
      }
    }
  }
}

// 테이블 셀 내용 영역
.table-cell-content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.table-cell-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: var(--font-adm-sm);
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;

  .pill-icon {
    font-size: 14px;
    width: 14px;
    height: 14px;

    // SVG 아이콘 색상 적용
    :deep(svg) {
      fill: currentColor;
      color: currentColor;
    }
  }

  // 에러 타입 (빨간 배경)
  &.pill-error {
    background-color: #fff0f0; // 연한 빨간색 배경
    color: var(--colorWheel10); // 빨간색 텍스트
    //border: 1px solid #ffcccc;
  }

  // 경고 타입
  &.pill-warning {
    background-color: #fffbf0;
    color: #d97706;
    border: 1px solid #fde68a;
  }

  // 성공 타입
  &.pill-success {
    background-color: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
}

// 아이콘 + 텍스트 형태
.table-cell-icon-text {
  display: flex;
  align-items: center;
  gap: 6px;

  // SVG 아이콘 색상 적용
  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: var(--colorMain);
    color: var(--colorMain);
  }

  // 아이콘 컴포넌트에 직접 스타일 적용
  > * {
    color: var(--colorMain);
    fill: var(--colorMain);
  }
}

// 텍스트 타입 (색상 적용 가능)
.table-cell-text {
  display: inline-block;
  word-break: break-word;
}

// 라디오 버튼 영역 - 프로젝트 기본 스타일 사용
// .modal-cont-border {
//   .check-wrap {
//     .check-list {
//       .check-item-txt {
//         :deep(span) {
//           display: block;
//           margin-top: 4px;
//           font-size: 12px;
//           color: #6b7280;
//         }
//       }
//     }
//   }
// }
</style>
