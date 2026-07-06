<template>
  <lxp-loading v-if="refreshLoading" />
  <lxp-skeleton-grid v-if="loading" />
  <div class="grid-wrapper">
    <!-- 2025.03.10[ygpark]: 그리드 내부 툴팁 노출을 위함 Boolean 타입 gridVisible 값 추가(gridVisible가 true면 overflow:visible 적용) -->
    <div
      :id="`toast-grid-${gridId}-${id}`"
      :class="gridVisible ? 'grid-visible' : ''"
    />

    <!-- 2026.04.09[mhlim]: 컬럼 설정 툴팁 -->
    <lxp-toast-column-setting-tooltip
      :grid-id="gridId"
      :grid-columns="initialColumnList"
      v-model:model="checkedColumn"
      :set-tooltip-show="setTooltipShow"
      @save-custom-grid-columns="saveCustomGridColumns"
      @reset="btnReset"
      ref="setTooltipRef"
    />

    <div
      class="tooltip edit-tooltip"
      ref="editTooltipRef"
      v-show="editTooltipShow"
    >
      <transition name="fade">
        <div class="tooltip-box">
          <ul class="tooltip-list">
            <li class="item" v-for="(list, i) in gridData">
              <button type="button" class="btn-edit">{{ list.TEXT }}</button>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div class="pagination" v-if="options.pageOptions" :class="pageType">
      <div class="btn-wrap">
        <button
          type="button"
          class="btn-first"
          :title="wbtagMessage('first.page', '첫페이지')"
          @click="paging('first')"
          :disabled="pagination.current <= 1"
        >
          <i class="fi-double-chevron-left" />
        </button>

        <button
          type="button"
          class="btn-prev"
          :title="wbtagMessage('com.previous', '이전')"
          @click="paging('prev')"
          :disabled="pagination.current <= 1"
        >
          <i class="fi-chevron-left" />
        </button>

        <div class="count">
          <input
            class="current"
            type="text"
            v-imask="numberMask"
            :value.number="pagination.current"
            @accept="onAccept($event)"
            @keyup.enter="movePage()"
            :disabled="pagination.total <= 1"
          />
          <!-- <strong class="current">{{ pagination.current || 1 }}</strong > -->
          &nbsp; /
          <span class="total">{{ pagination.total || 1 }}</span>
          <button @click="movePage()">이동</button>
        </div>

        <button
          type="button"
          class="btn-next"
          :title="wbtagMessage('com.next', '다음')"
          @click="paging('next')"
          :disabled="pagination.current >= pagination.total"
        >
          <i class="fi-chevron-right" />
        </button>

        <button
          type="button"
          class="btn-last"
          :title="wbtagMessage('last.page', '마지막페이지')"
          @click="paging('last')"
          :disabled="pagination.current >= pagination.total"
        >
          <i class="fi-double-chevron-right" />
        </button>
      </div>

      <select
        class="select-default"
        aria-label="perPage"
        v-model="pagination.perPage"
        @change="perPageChange()"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="500">500</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import 'tui-date-picker/dist/tui-date-picker.css'; // datepicker 사용 시 넣어주세요
import 'tui-time-picker/dist/tui-time-picker.css'; // datepicker 사용 시 넣어주세요
import 'tui-pagination/dist/tui-pagination.css';
import '@/assets/scss/lxp/components/tui-custom.scss';
import { onClickOutside } from '@vueuse/core';
import * as d3 from 'd3';
import { numberMaskOverZero, numberMask } from '@/assets/js/mask/maskConfigs';

const route = useRoute();
const grid = ref();
const gridColumns = ref([]);
const initialColumnList = ref([]);

// 컨텍스트 메뉴 관련
const contextMenuEl = ref(null);
let contextMenuAction = null; // 메뉴 클릭 이벤트 위임용

const createContextMenu = () => {
  const menu = document.createElement('div');
  menu.className = 'tui-grid-context-menu';
  menu.style.cssText = 'display:none; position:fixed; z-index:9999;';

  // 이벤트 위임: 메뉴 항목 클릭 처리
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-action]');
    if (!item || !contextMenuAction) return;
    contextMenuAction(item.dataset.action);
  });

  document.body.appendChild(menu);
  return menu;
};

const hideContextMenu = () => {
  if (contextMenuEl.value) {
    contextMenuEl.value.style.display = 'none';
  }
  contextMenuAction = null;
};

const modelOptions = defineModel('options');

const getFrozenCount = async () => {
  // lside 영역에 있는 실제 컬럼 헤더 셀 수로 frozenCount 판단
  const gridEl = grid.value?.el;
  if (!gridEl) return 0;
  const lsideCells = gridEl.querySelectorAll(
    '.tui-grid-lside-area .tui-grid-header-area .tui-grid-cell-header'
  );
  let count = 0;
  const columns = [];
  lsideCells.forEach((cell) => {
    const name = cell.getAttribute('data-column-name');
    columns.push(cell);
    if (name && name !== '_number' && name !== '_checked') count++;
  });

  await nextTick();

  // 고정 컬럼 마지막 인덱스 셀 노드 추출
  const frozenColumn = columns.pop();

  return {
    frozenCount: count, // 고정 컬럼 
    frozenColumn: frozenColumn // 고정 컬럼 마지막 인덱스 셀 노드
  };
};

// 2026.04.08 [mhlim]: 헤더 컬럼 우측 클릭 시, 컬럼 고정 레이어 생성
const createFreezeLine = async () => {
  const frozenCell = (await getFrozenCount())?.frozenColumn;

  // 뷰포트 기준 셀 위치 추출
  const cellRect = frozenCell.getBoundingClientRect();
  // 그리드 컨테이너 요소 추출
  const container = frozenCell.closest('.tui-grid-container');
  // 셀을 포함한 컨테이너 위치 추출
  const containerRect = container.getBoundingClientRect();

  if (cellRect && containerRect) {
    // x좌표 추출
    const left = cellRect.left - containerRect.left;
    // y좌표 추출
    const top = cellRect.top - containerRect.top;
    // 셀 너비 추출
    const cellWidth = cellRect.width;

    // 컬럼 고정 레이어 요소 생성
    const columnFreezeLayerEl = document.createElement('div');
    columnFreezeLayerEl.className = 'column-freeze-layer';
    
    columnFreezeLayerEl.style.position = 'absolute';
    // (좌측 좌표 + 셀 너비) - 고정 레이어 크기 절반인 8px 만큼 최종 좌표 이동
    columnFreezeLayerEl.style.left = `${left + cellWidth - 8}px`;
    columnFreezeLayerEl.style.top = `${top}px`;
    columnFreezeLayerEl.style.width = '16px';
    // scrollbar 높이 17px 제외
    columnFreezeLayerEl.style.height = 'calc(100% - 15px)';
    columnFreezeLayerEl.style.zIndex = '100';

    // 그리드 컨테이너에 컬럼 고정 레이어 요소 추가
    container.appendChild(columnFreezeLayerEl);

    // 고정 선 요소 생성
    const lineEl = document.createElement('span');

    lineEl.style.display = 'block';
    lineEl.style.width = '1px';
    lineEl.style.height = '100%';
    lineEl.style.background = 'var(--colorMain)';
    lineEl.style.borderRadius = '50%';
    lineEl.style.position = 'absolute';
    lineEl.style.left = '50%';
    lineEl.style.top = '0';
    lineEl.style.transform = 'translateX(-50%)';

    columnFreezeLayerEl.appendChild(lineEl);

    // 고정 컬럼 핀 아이콘 포함하는 circle 요소 생성
    const circleEl = document.createElement('div');

    circleEl.style.position = 'absolute';
    circleEl.style.left = '0';
    circleEl.style.top = '-10px';
    circleEl.style.width = '20px';
    circleEl.style.height = '20px';
    circleEl.style.borderRadius = '50%';
    circleEl.style.background = 'var(--colorMain)';
    circleEl.className = 'freeze-line-icon';
    circleEl.style.display = 'flex';
    circleEl.style.alignItems = 'center';
    circleEl.style.justifyContent = 'center';

    columnFreezeLayerEl.appendChild(circleEl);

    // 고정 컬럼 핀 아이콘
    d3.selectAll('.freeze-line-icon')
    .append('svg')
    .attr('width', '12')
    .attr('height', '12')
    .attr('viewBox', '0 0 50 50')
    .attr('fill', 'none')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .append('path')
    .attr('d', "M29.2992 0.119606C30.8015 -0.123722 32.3431 -0.00635761 33.7914 0.461403C35.2392 0.929205 36.5564 1.73684 37.6322 2.81297L47.1781 12.3628C48.2537 13.4374 49.0528 14.7528 49.5209 16.1997C49.9889 17.6468 50.1097 19.185 49.8666 20.687C49.6235 22.1887 49.0262 23.6114 48.1254 24.8374C47.3373 25.91 46.3368 26.8071 45.1879 27.4702L44.684 27.7387L36.0248 32.0639L33.5355 39.2534L33.5395 39.2573C33.1756 40.3231 32.5445 41.2802 31.7084 42.0356C30.8725 42.7904 29.8577 43.3195 28.7621 43.5737C27.6657 43.8279 26.5213 43.7985 25.4389 43.4887C24.6268 43.2562 23.8682 42.8706 23.2045 42.3569L22.5736 41.8003L18.3266 37.5522L7.10488 48.7749C5.47783 50.4019 2.84036 50.4019 1.21328 48.7749C-0.413419 47.1478 -0.413665 44.5102 1.21328 42.8833L12.4281 31.6675L8.18692 27.4214C7.39059 26.6242 6.80837 25.6345 6.49844 24.5522C6.18903 23.4706 6.15968 22.3256 6.41348 21.228L6.65274 20.4233C6.94378 19.636 7.38551 18.9101 7.95059 18.2827L8.54922 17.6928C9.18461 17.1456 9.92085 16.723 10.7182 16.4477L17.9076 13.9575L22.2445 5.3032L22.517 4.8032C23.1804 3.65318 24.077 2.65005 25.1498 1.86179C26.3758 0.961336 27.7978 0.362988 29.2992 0.119606ZM30.6342 8.34715C30.4347 8.37946 30.2429 8.45927 30.0805 8.57859C30.0003 8.6377 29.9293 8.70736 29.8656 8.78269L29.6986 9.03465L24.8773 18.6655L24.8725 18.6616C24.5512 19.3113 24.1111 19.8973 23.5668 20.3784C23.0143 20.8665 22.3676 21.2334 21.6703 21.4721L21.6752 21.477L15.9867 23.4419L20.2143 27.6694L22.3217 29.7602L22.3344 29.7729L26.5453 33.9878L28.5141 28.3081C28.7531 27.6144 29.1231 26.9714 29.6088 26.4204L29.9955 26.0259C30.2659 25.774 30.56 25.548 30.8744 25.354L31.3627 25.0854L40.9564 20.2886L41.2045 20.1216C41.2812 20.057 41.3529 19.983 41.4125 19.9018C41.5304 19.7407 41.608 19.5537 41.64 19.3569C41.672 19.1594 41.6569 18.9542 41.5951 18.7632C41.5336 18.5734 41.4279 18.4 41.2865 18.2583L31.7367 8.70457C31.5944 8.56229 31.42 8.4541 31.2279 8.39207C31.0364 8.33039 30.833 8.31513 30.6342 8.34715Z")
    .attr('fill', '#fff');
  }
}

const showContextMenu = async (e, columnName) => {
  if (!contextMenuEl.value) {
    contextMenuEl.value = createContextMenu();
  }

  const menu = contextMenuEl.value;
  const columns = grid.value.getColumns();
  const frozenCount = (await getFrozenCount())?.frozenCount;

  const columnIndex = columns.findIndex((col) => col.name === columnName);
  if (columnIndex < 0) return;

  // 메뉴 구성
  const items = [];

  // 현재 고정 인덱스의 컬럼인 경우, 컬럼 고정 해제
  if (frozenCount - 1 === columnIndex) {
    items.push({ action: 'unfreeze', label: '컬럼 고정 해제' });
  } else {
    // 현재 고정 경계와 다른 위치면 "이 컬럼까지 고정" 표시
    items.push({ action: 'freeze', label: `${columnIndex + 1}열까지 고정`});
  }

  if (!items.length) return;

  // DOM 구성 (이벤트는 위임으로 처리하므로 리스너 누적 없음)
  while (menu.firstChild) menu.removeChild(menu.firstChild);
  items.forEach(({ action, label }) => {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    item.textContent = label;
    item.dataset.action = action;
    menu.appendChild(item);
  });

  // 클릭 액션 등록
  contextMenuAction = async (action) => {
    if (action === 'freeze') {
      grid.value.setFrozenColumnCount(columnIndex + 1);

      const layerNodes = d3.selectAll('.column-freeze-layer');

      if (layerNodes.size() > 0) {
        layerNodes.remove();
      }

      await nextTick();

      await createFreezeLine();

    } else if (action === 'unfreeze') {
      grid.value.setFrozenColumnCount(0);

      const layerNodes = d3.selectAll('.column-freeze-layer');

      if (layerNodes.size() > 0) {
        layerNodes.remove();
      }

      await nextTick();

      await createFreezeLine();
    }
    hideContextMenu();
  };

  // 위치 계산 (화면 밖 넘침 방지)
  menu.style.display = 'block';
  menu.style.left = '0px';
  menu.style.top = '0px';

  const menuRect = menu.getBoundingClientRect();
  let left = e.clientX;
  let top = e.clientY;

  if (left + menuRect.width > window.innerWidth) {
    left = window.innerWidth - menuRect.width - 4;
  }
  if (top + menuRect.height > window.innerHeight) {
    top = window.innerHeight - menuRect.height - 4;
  }

  menu.style.left = left + 'px';
  menu.style.top = top + 'px';
};

const checkedColumn = ref([]);
const loading = ref(false);
const refreshLoading = ref(false);
const id = useId();
const props = defineProps({
  options: {
    type: Object,
    default: {},
  },
  gridId: Number,
  gridVisible: Boolean,
  columnData: Array,
  gridData: Array,
  initialColumns: Array,
  noData: {
    type: String,
    default: '해당 조건에 맞는 데이터가 없습니다.',
  },
  pageType: String,
  // 그리드 컴포넌트 선언 부모 유형 (ex) 목록 > 'list')
  declareParentType: {
    type: String,
    default: '',
  },
});

/* 페이지네이션 */
const { $search } = useNuxtApp();
const pagination = ref({
  total: 0,
  current: 0,
  perPage: 5,
});

let tuiGridCell; // 그리드 컬럼
let tuiGridCellInput; // 그리드 컬럼

/* 상단 설정버튼 툴팁 */
const setTooltipRef = ref();
// 2025.05.07[ebyook]: setTooltipShow를 그리드별로 관리되는 객체로 변경(원래는 boolean)
const setTooltipShow = ref({});

// 2025.05.07[ebyook]: 각 그리드의 gridId를 키로 사용해서 상태를 변경
const openTooltip = (gridId) => {
  setTooltipShow.value[gridId] = true;
};
const closeTooltip = (gridId) => {
  setTooltipShow.value[gridId] = false;
};

onClickOutside(setTooltipRef, (event) => {
  if (event.target.parentElement.classList.contains('btn-setting') === false) {
    closeTooltip(props.gridId);

    const btnSetting = document.querySelector('.btn-setting');

    if (btnSetting) {
      btnSetting.setAttribute('title', '설정');
      btnSetting.classList.remove('is-active');
    }
  }
});

/* 상단 수정버튼 툴팁 */
const editTooltipRef = ref();
const editTooltipShow = ref(false);
onClickOutside(editTooltipRef, (event) => {
  editTooltipShow.value = !editTooltipShow.value;
  if (event.target.classList.contains('.btn-more') === false) {
    editTooltipShow.value = false;

    const btnMore = document.querySelectorAll('.btn-more');
    btnMore.forEach((item) => {
      item.classList.remove('is-active');
    });
  }
});

/* 상단 필터버튼 툴팁 */
const selectTooltipRef = ref();
const selectTooltipShow = ref(false);

onClickOutside(selectTooltipRef, (event) => {
  selectTooltipShow.value = !selectTooltipShow.value;
  if (event.target.classList.contains('.btn-select') === false) {
    selectTooltipShow.value = false;

    const btnSelect = document.querySelector('.btn-select');
    if (btnSelect) {
      btnSelect.classList.remove('is-active');
    }
  }
});

Grid.setLanguage('ko');

Grid.setLanguage('ko', {
  display: {
    noData: `${props.noData}`,
  },
});

Grid.applyTheme('clean', {
  scrollbar: {
    background: 'transparent',
    border: 'transparent',
    emptySpace: 'transparent',
  },
});

const emit = defineEmits(['getGrid', 'getDropData', 'getClickData', 'loadGridColumn']);

// 2023.09.07[cgnoh]: 수정툴팁
const makeEditTooltip = () => {
  tuiGridCellInput = document.querySelectorAll(
    `#toast-grid-${props.gridId}-${id} .tui-grid-cell-has-input`
  ); // 그리드 컬럼 값

  tuiGridCellInput.forEach((item) => {
    if (item.getAttribute('data-column-name') === 'hasSetting') {
      const btnEl = document.createElement('button');
      btnEl.className = 'btn-more';

      const iconEl = document.createElement('i');
      btnEl.appendChild(iconEl);

      // 2024.10.25 [hlpark] #13285 배송관리 툴팁 버튼 비활성화
      // iconEl.className = 'fi-dots-vertical';
      // item.appendChild(btnEl);

      iconEl.addEventListener('click', (event) => {
        const currentX = event.pageX + 50;
        const currentY = event.pageY - 20;

        if (editTooltipShow.value === true) {
          editTooltipShow.value = false;
          btnEl.classList.remove('is-active');
        } else {
          editTooltipShow.value = true;
          btnEl.classList.add('is-active');
        }

        document.querySelector('.edit-tooltip').style.top = currentY + 'px';
        document.querySelector('.edit-tooltip').style.left = currentX + 'px';
      });
    }
  });
};

// 2023.09.07[cgnoh]: 설정툴팁
const makeSetTooltip = () => {
  tuiGridCell = document.querySelectorAll(
    `#toast-grid-${props.gridId}-${id} .tui-grid-cell-header`
  ); // 그리드 컬럼 값

  tuiGridCell.forEach((item) => {
    if (item.getAttribute('data-column-name') === 'hasSetting') {
      item.style.fontSize = 0;

      const btnEl = document.createElement('button');
      btnEl.className = 'btn-setting';
      btnEl.setAttribute('title', '설정');

      const iconEl = document.createElement('i');
      iconEl.className = 'fi-nav-setting';
      iconEl.style.fontSize = '16px';

      btnEl.appendChild(iconEl);
      item.appendChild(btnEl);

      btnEl.addEventListener('click', (event) => {
        if (setTooltipShow.value[props.gridId]) {
          closeTooltip(props.gridId);
          btnEl.classList.remove('is-active');
        } else {
          openTooltip(props.gridId);
          btnEl.classList.add('is-active');
        }
      });
    }
  });
};

// 헤더 인포 툴팁용 전역 상태
let activeHeaderTooltip = null;
let activeHeaderButton = null;
let headerTooltipOutsideHandlerRegistered = false;
let headerTooltipScrollHandlerRegistered = false;

function closeActiveHeaderTooltip() {
  if (activeHeaderTooltip) {
    activeHeaderTooltip.classList.remove('is-active');
  }
  if (activeHeaderButton) {
    activeHeaderButton.classList.remove('is-active');
  }
  activeHeaderTooltip = null;
  activeHeaderButton = null;
}
//헤더 인포 툴팁 바깥 클릭 핸들러 등록
function registerHeaderTooltipOutsideHandler() {
  if (headerTooltipOutsideHandlerRegistered) return;
  headerTooltipOutsideHandlerRegistered = true;

  document.addEventListener('click', function (event) {
    if (!activeHeaderTooltip || !activeHeaderButton) return;

    const target = event.target;
    if (!target) return;

    if (
      activeHeaderTooltip.contains(target) ||
      activeHeaderButton.contains(target)
    ) {
      return;
    }

    closeActiveHeaderTooltip();
  });
}
//헤더 툴팁 생성
const makeHeaderInfoTooltip = () => {
  const headerCells = document.querySelectorAll(
    `#toast-grid-${props.gridId}-${id} .tui-grid-cell-header`
  );

  const gridElement = grid.value && grid.value.el;
  if (!gridElement) return;

  const gridWrapper = gridElement.closest('.grid-wrapper');
  const gridTop =
    (gridWrapper &&
      gridWrapper.previousElementSibling &&
      gridWrapper.previousElementSibling.querySelector('.grid-top')) ||
    document.querySelector('.grid-top');

  if (!gridTop) return;

  const targetColumns = (props.options.columns || []).filter(function (col) {
    const className = col.className || '';

    // 문자열인 경우: 'has-bg header-info-tooltip'
    const hasHeaderTooltip =
      typeof className === 'string' &&
      className.split(/\s+/).includes('header-info-tooltip');

    return hasHeaderTooltip && col.name && col.description;
  });
  if (!targetColumns.length) return;

  // 문서 바깥 클릭 핸들러 등록
  registerHeaderTooltipOutsideHandler();

  // 그리드 "가로 스크롤" 시에만 툴팁 닫기
  if (!headerTooltipScrollHandlerRegistered) {
    headerTooltipScrollHandlerRegistered = true;

    const scrollAreas = gridElement.querySelectorAll(
      '.tui-grid-body-area, .tui-grid-rside-area, .tui-grid-lside-area'
    );

    scrollAreas.forEach(function (area) {
      area._lastScrollLeft = area.scrollLeft;
      area._lastScrollTop = area.scrollTop;

      area.addEventListener('scroll', function () {
        var newLeft = area.scrollLeft;
        var newTop = area.scrollTop;

        if (newLeft !== area._lastScrollLeft) {
          closeActiveHeaderTooltip();
        }

        area._lastScrollLeft = newLeft;
        area._lastScrollTop = newTop;
      });
    });
  }

  targetColumns.forEach(function (col) {
    const headerCell = Array.prototype.find.call(headerCells, function (cell) {
      return cell.getAttribute('data-column-name') === col.name;
    });

    if (!headerCell) return;
    if (headerCell.querySelector('.btn-tooltip.custom-tooltip')) return;

    headerCell.style.fontWeight = '400';

    const btnEl = document.createElement('button');
    btnEl.className = 'btn-tooltip custom-tooltip';
    btnEl.setAttribute('title', '툴팁');

    const iconEl = document.createElement('i');
    iconEl.className = 'fi-circle-question';
    iconEl.style.fontSize = '14px';

    btnEl.appendChild(iconEl);

    const tooltipBoxEl = document.createElement('div');
    tooltipBoxEl.className = 'tooltip-toast';

    const spanEl = document.createElement('span');
    spanEl.className = 'txt';
    spanEl.textContent = col.description;
    tooltipBoxEl.appendChild(spanEl);

    const closeButtonEl = document.createElement('button');
    closeButtonEl.type = 'button';
    closeButtonEl.className = 'btn-close';

    const closeIconEl = document.createElement('i');
    closeIconEl.className = 'fi-xmark-thin';
    closeButtonEl.appendChild(closeIconEl);

    tooltipBoxEl.appendChild(closeButtonEl);

    closeButtonEl.addEventListener('click', function () {
      tooltipBoxEl.classList.remove('is-active');
      btnEl.classList.remove('is-active');

      if (activeHeaderTooltip === tooltipBoxEl) {
        closeActiveHeaderTooltip();
      }
    });

    gridTop.appendChild(tooltipBoxEl);
    headerCell.appendChild(btnEl);

    btnEl.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest('.fi-circle-question')) {
        var isActive = btnEl.classList.toggle('is-active');

        if (isActive) {
          if (activeHeaderTooltip && activeHeaderTooltip !== tooltipBoxEl) {
            closeActiveHeaderTooltip();
          }

          var headerRect = headerCell.getBoundingClientRect();
          var gridTopRect = gridTop.getBoundingClientRect();

          tooltipBoxEl.classList.add('is-active');
          tooltipBoxEl.style.visibility = 'hidden';

          var tooltipWidth = tooltipBoxEl.offsetWidth;

          var top = headerRect.bottom - gridTopRect.top;

          var left = headerRect.left - gridTopRect.left + 100;

          // 오른쪽으로 넘어갔을때 위치조정
          var maxLeft = gridTopRect.width - tooltipWidth + 100;
          if (left > maxLeft) {
            left = maxLeft;
          }

          tooltipBoxEl.style.top = top + 'px';
          tooltipBoxEl.style.left = left + 'px';

          tooltipBoxEl.style.visibility = '';

          activeHeaderTooltip = tooltipBoxEl;
          activeHeaderButton = btnEl;
        } else {
          tooltipBoxEl.classList.remove('is-active');

          if (activeHeaderTooltip === tooltipBoxEl) {
            closeActiveHeaderTooltip();
          }
        }
      }
    });
  });
};

//출석률 문구 안내
// 2025.01.23[wschoe]: 툴팁을 그리드 DOM 외부로 이전
const makeAttendanceInfo = () => {
  const targetClassName = 'has-bg';
  tuiGridCell = document.querySelectorAll(
    `#toast-grid-${props.gridId}-${id} .tui-grid-cell-header`
  ); // 그리드 컬럼 값
  const index = props.options.columns.findIndex(
    (obj) => obj.name === 'ATTENDANCE_RATE'
  );

  // 툴팁을 grid-top DOM로 이전
  const gridTop = document.querySelector('.grid-top');

  tuiGridCell.forEach((item) => {
    if (item.getAttribute('data-column-name') === 'ATTENDANCE_RATE') {
      item.style.fontWeight = '400';

      const btnEl = document.createElement('button');
      btnEl.className = 'btn-tooltip custom-tooltip';
      btnEl.setAttribute('title', '툴팁');

      const iconEl = document.createElement('i');
      iconEl.className = 'fi-circle-question';
      iconEl.style.fontSize = '14px';

      btnEl.appendChild(iconEl);

      const tooltipBoxEl = document.createElement('div');
      tooltipBoxEl.className = 'tooltip-toast';

      const spanEl = document.createElement('span');
      spanEl.className = 'txt';
      spanEl.textContent = props.options.columns[index].description;
      tooltipBoxEl.appendChild(spanEl);

      const closeButtonEl = document.createElement('button');
      closeButtonEl.type = 'button';
      closeButtonEl.className = 'btn-close';

      const closeIconEl = document.createElement('i');
      closeIconEl.className = 'fi-xmark-thin';
      closeButtonEl.appendChild(closeIconEl);

      tooltipBoxEl.appendChild(closeButtonEl);

      closeButtonEl.addEventListener('click', () => {
        tooltipBoxEl.classList.remove('is-active');
        btnEl.classList.toggle('is-active'); // `is-active` 클래스 제거
      });

      // 툴팁을 .grid-wrapper에 추가
      gridTop.appendChild(tooltipBoxEl);
      item.appendChild(btnEl);

      btnEl.addEventListener('click', (event) => {
        if (event.target.closest('.fi-circle-question')) {
          const isActive = btnEl.classList.toggle('is-active');
          if (isActive) {
            tooltipBoxEl.classList.add('is-active');
          } else {
            tooltipBoxEl.classList.remove('is-active');
          }
        }
      });
    }
  });
};

// 2024.07.08[cgnoh]: 커스텀툴팁
const makeSetCustom = () => {
  // 툴팁 className
  const targetClassName = 'has-tooltip';

  // 배열 내에서 className 속성이 targetClassName 과 일치하는 객체의 index
  const index = props.options.columns.findIndex(
    (obj) => obj.className === targetClassName
  );

  // 컬럼배열을 반복문 돌면서
  props.options.columns.forEach((data) => {
    // 컬럼 배열안에서 className 이 has-tooltip 과 일치할때
    if (data.className === 'has-tooltip') {
      const item = grid.value.el
        .querySelectorAll('.tui-grid-table')[2]
        .querySelectorAll('.tui-grid-cell')[index];
      item.classList.add('has-tooltip');

      const btnEl = document.createElement('button');
      btnEl.className = 'btn-tooltip custom-tooltip';
      btnEl.setAttribute('title', '툴팁');

      const iconEl = document.createElement('i');
      iconEl.className = 'fi-circle-question';
      iconEl.style.fontSize = '16px';

      btnEl.appendChild(iconEl);

      // 새로운 div 요소 생성
      const tooltipBoxEl = document.createElement('div');
      tooltipBoxEl.className = 'tooltip-box row-header';

      // span 요소 생성 및 추가
      const spanEl = document.createElement('span');
      spanEl.className = 'txt';
      spanEl.textContent = props.options.columns[index].description;
      tooltipBoxEl.appendChild(spanEl);

      // button 요소 생성 및 추가
      const closeButtonEl = document.createElement('button');
      closeButtonEl.type = 'button';
      closeButtonEl.className = 'btn-close';

      // i 요소 생성 및 추가
      const closeIconEl = document.createElement('i');
      closeIconEl.className = 'fi-xmark-thin';
      closeButtonEl.appendChild(closeIconEl);

      // close button을 tooltipBox에 추가
      tooltipBoxEl.appendChild(closeButtonEl);

      // tooltipBox를 btnEl에 추가
      btnEl.appendChild(tooltipBoxEl);

      // 최종적으로 btnEl을 item에 추가
      item.appendChild(btnEl);

      btnEl.addEventListener('click', (event) => {
        if (event.target.closest('.btn-close')) {
          btnEl.classList.remove('is-active');
        }
        if (event.target.closest('.fi-circle-question')) {
          btnEl.classList.toggle('is-active');
        }
      });
    }
  });
};

// 2026.02.12[ygpark]: 텍스트 셀에 title 추가 (호버 시 전체 텍스트 표시)
const applyEllipsisTitleToCells = () => {
  const container = grid.value?.el;

  if (!container) return;

  const cells = container.querySelectorAll('.tui-grid-cell');

  cells.forEach((cell) => {
    if (cell.closest('.tui-grid-header-area')) return;

    const content = cell.querySelector('.tui-grid-cell-content');
    const hasButton = cell.querySelector('button, .btn, .button-container, .btn-more, .btn-setting');

    if (hasButton) {
      cell.removeAttribute('title');

      if (content) content.removeAttribute('title');

      return;
    }

    //no-title이 붙은 tui-grid-cell-content은 title을 붙이지 않도록 제외
    if (content?.classList.contains('no-title')) {
      return;
    }

    const target = content || cell;
    const text = (target.textContent || '').trim();

    // 텍스트가 있고 '-'가 아니라면 title 추가
    if (text && text !== '-') {
      target.setAttribute('title', text);

      if (content && target === content) cell.removeAttribute('title');
    } else {
      target.removeAttribute('title');
      cell.removeAttribute('title');
    }
  });
};

// 2024.01.08[hjlee]: 설정 초기화
const btnReset = () => {
  // 2024.01.08[hjlee]: 설정에 체크된 값 초기화
  checkedColumn.value = [];

  // 2024.01.08[hjlee]: 전체 컬럼 checkedColumn으로 셋팅
  for (let i = 0; i < initialColumnList.value.length; i++) {
    checkedColumn.value.push(initialColumnList.value[i].name);
  }
};

// 2023.08.30[mhlim]: 그리드 컬럼 설정 저장 이벤트
const saveCustomGridColumns = async () => {
  const reorderCheckedColumn = [];

  // 2026.04.14[mhlim]: 컬럼 설정 목록에서 순서 변경된 컬럼 배열 참조
  // -> 체크된 컬럼만 필터링하여 반환
  await Promise.all(initialColumnList.value.map(async (item) => {
    checkedColumn.value.forEach((column) => {
      if (item.name === column) {
        reorderCheckedColumn.push(column);
      }
    });
  }))

  try {
    // 고유 식별자 그리드 아이디와 체크 컬럼 목록 배열 담아 저장 요청
    const result = await useWbFetch('/grid/user/column', {
      method: 'POST',
      baseURL: 'education',
      body: {
        gridId: props.gridId,
        columns: reorderCheckedColumn,
      },
    });

    if (result.success) {
      await nextTick();
    
      useToast().show('컬럼 설정이 저장되었습니다.');

      refreshLoading.value = true;

      emit('loadGridColumn');

      setTimeout(async () => {
        setCheckboxValue();

        // 셋팅 컬럼 제외한 컬럼 목록
        const columnOption = modelOptions.value.columns.filter((column) => column.name !== 'hasSetting');
        
        // 변경된 커스텀 설정 목록 값으로 컬럼 동적 셋팅 후 레이아웃 갱신
        await grid.value.setColumns(modelOptions.value.columns);

        columnOption.forEach((column) => {
        // 체크 되어있는 컬럼만 노출 처리
        if (checkedColumn.value.includes(column.name)) {
          grid.value.showColumn(column.name, true);
        } else {
          // 체크 해제된 컬럼 미노출 처리
          grid.value.hideColumn(column.name, true);
        }
      });

      // 컬럼 설정 툴팁 종료
      closeTooltip(props.gridId);

      await grid.value.refreshLayout();
      refreshLoading.value = false;
      }, 500)
    }
  } catch (err) {
    console.error(err);
    useToast().show('컬럼 설정 저장 중 오류가 발생했습니다.');
  }
};

// 2023.09.12[cgnoh]: 상태툴팁 호출
const makeStateTooltip = () => {
  tuiGridCell = document.querySelectorAll('.tui-grid-cell-header'); // 그리드 컬럼 값

  tuiGridCell.forEach((item) => {
    if (item.getAttribute('data-column-name') === 'COURSE_TYPE') {
      const btnEl = document.createElement('button');
      btnEl.className = 'btn-select';

      item.appendChild(btnEl);

      btnEl.addEventListener('click', (event) => {
        const currentX = event.pageX + 40;
        const currentY = event.pageY - 25;

        if (selectTooltipShow.value === true) {
          selectTooltipShow.value = false;
          btnEl.classList.remove('is-active');
        } else {
          selectTooltipShow.value = true;
          btnEl.classList.add('is-active');
        }

        document.querySelector('.select-tooltip').style.top = currentY + 'px';
        document.querySelector('.select-tooltip').style.left = currentX + 'px';
        document.querySelector('.select-tooltip').style.right = 'auto';
      });
    }
  });
};

const btnListUp = () => {
  grid.value.sort('EDU_CONTENTS_TYPE', true, true);
};

const btnListDown = () => {
  grid.value.sort('EDU_CONTENTS_TYPE', false, true);
};

const paging = (type) => {
  const gridPagination = grid.value.getPagination();
  const current = Math.floor(pagination.value.current);
  const total = pagination.value.total;
  let movePage = 1;

  if (type === 'first') {
    movePage = 1;
  } else if (type === 'prev' && current !== 1) {
    movePage = current - 1;
  } else if (type === 'next' && current !== pagination.value.total) {
    movePage = current + 1;
  } else if (type === 'last') {
    movePage = total;
  }

  if (movePage > total) {
    movePage = total;
  }

  pagination.value.current = movePage;
  gridPagination.movePageTo(movePage);
  $search.setSearchPage(movePage);
};

// 2025.09.17[shhan]: input 영역이 빈문자열로 된 경우 1로 초기화
const onInput = (event) => {
  const inputValue = event.target.value;

  if (!/^(0|[1-9][0-9]*)$/.test(inputValue)) {
    pagination.value.current = 1;
  } else {
    pagination.value.current = inputValue;
  }
};

const onAccept = (event) => {
  pagination.value.current = event.target.value;
};

const movePage = () => {
  const current = Math.floor(pagination.value.current);

  const gridPagination = grid.value.getPagination();

  const total = pagination.value.total;
  let movePage = 1;

  if (current > total || current < 1) {
    useToast().show('이동할 수 없는 페이지입니다. 페이지 번호를 확인하세요.');
    return;
  }

  movePage = current;

  pagination.value.current = movePage;
  gridPagination.movePageTo(movePage);
  $search.setSearchPage(movePage);
};

// 2023.09.01[jrjang]: 체크박스 체크여부 세팅
const setCheckboxValue = () => {
  // 2023.09.01[jrjang]: 사용자가 체크한 컬럼 리스트
  let customColumns = props.columnData ? props.columnData : [];

  checkedColumn.value = [];

  // 2023.09.01[jrjang]: 사용자가 체크한 컬럼이 하나라도 있다면
  if (customColumns && customColumns.length > 0) {
    // 2023.09.01[jrjang]: 그리드의 모든 컬럼을 hidden 처리
    for (let i = 0; i < gridColumns.value.length; i++) {
      if (
        gridColumns.value[i].name != 'hasSetting' &&
        gridColumns.value[i].name != undefined &&
        grid.value.getIndexOfColumn(gridColumns.value[i].name) >= 0
      ) {
        grid.value.hideColumn(gridColumns.value[i].name, true);
      }
    }

    // 2023.09.01[jrjang]: 사용자가 체크한 컬럼만 show 처리
    for (let i = 0; i < customColumns.length; i++) {
      if (
        gridColumns.value[i] != undefined &&
        gridColumns.value[i].name != 'hasSetting'
      ) {
        checkedColumn.value.push(customColumns[i]);
      }

      if (grid.value.getIndexOfColumn(customColumns[i]) >= 0) {
        grid.value.showColumn(customColumns[i], true);
      }
    }
  } else {
    // 2023.09.01[jrjang]: 사용자가 체크한 컬럼이 없다면
    for (let i = 0; i < gridColumns.value.length; i++) {
      // 2023.09.01[jrjang]: 전체 컬럼 체크처리
      if (
        gridColumns.value[i].name != 'hasSetting' &&
        gridColumns.value[i].name != undefined
      ) {
        checkedColumn.value.push(gridColumns.value[i].name);
      }
    }
  }
};

onMounted(async () => {
  // 2024.09.05[mhlim]: 페이지에서 넘겨받은 option props 값에서 rowHeaders 설정 값 추출
  const propsRowHeadersOption = props.options.rowHeaders ?? [];

  // 2024.09.05[mhlim]: 변경 할 rowHeaders rowNum 설정 값
  const rowNumOption = {
    type: 'rowNum',
    width: 80,
  };

  // 2024.09.05[mhlim]: rowHeaders 설정 배열에서 기존 rowNum 설정 값을 변경 값으로 포맷
  for (let i = 0; i < propsRowHeadersOption.length; i++) {
    if (propsRowHeadersOption[i] === 'rowNum') {
      propsRowHeadersOption[i] = rowNumOption;
    }
  }

  props.options.el = document.getElementById(
    `toast-grid-${props.gridId}-${id}`
  );
  if (!Array.isArray(props.options.data)) {
    props.options.data = [];
  }

  props.options.onGridUpdated = (e) => {
    const gridPagination = e.instance.getPagination();
    if (gridPagination) {
      const totalItems = gridPagination._options.totalItems;
      const perPage = gridPagination._options.itemsPerPage;

      pagination.value.current = gridPagination._currentPage;
      pagination.value.total = Math.ceil(totalItems / perPage);
    }

    nextTick(applyEllipsisTitleToCells);
  };

  grid.value = new Grid(props.options);

  emit('getGrid', grid.value);

  grid.value.on('drop', (ev) => {
    emit('getDropData', ev);
    // row
    //   ev.rowKey - The rowKey of the dragging row
    //   ev.targetRowKey - The rowKey of the row at current dragging position
    //   ev.appended - Whether the row is appended to other row as the child in tree data.
    // column
    //   ev.columnName - The column name of the dragging column
    //   ev.targetColumnName - The column name of b the column at current dragging position
  });

  grid.value.on('click', (ev) => {
    emit('getClickData', ev);
  });

  // 2024.01.09[hjlee]: filter 처리시 페이징 처리되도록 수정
  grid.value.on('afterFilter', (ev) => {
    pagination.value.current = 1;
    pagination.value.total = Math.ceil(
      grid.value.getPaginationTotalCount() / pagination.value.perPage
    );
  });

  // 2024.01.09[hjlee]: filter 모두 해제시 페이징 처리되도록 수정
  grid.value.on('afterUnfilter', (ev) => {
    pagination.value.current = 1;
    pagination.value.total = Math.ceil(
      grid.value.getPaginationTotalCount() / pagination.value.perPage
    );
  });

  // 2026.02.12[ygpark]: 텍스트 셀에 title 추가 (호버 시 전체 텍스트 표시)
  grid.value.on('afterChange', () => nextTick(applyEllipsisTitleToCells));
  grid.value.on('afterPageMove', (ev) => {
    if (ev?.page) pagination.value.current = ev.page;
    nextTick(applyEllipsisTitleToCells);
  });
  grid.value.on('columnResize', () => nextTick(applyEllipsisTitleToCells));

  const gridEl = grid.value.el;
  if (gridEl) {
    const scrollAreas = gridEl.querySelectorAll(
      '.tui-grid-body-area, .tui-grid-rside-area'
    );
    scrollAreas.forEach((area) => {
      area.addEventListener('scroll', () => {
        nextTick(applyEllipsisTitleToCells);
        hideContextMenu();
      });
    });

    // 헤더 영역 우클릭 시 컨텍스트 메뉴 표시
    const headerAreas = gridEl.querySelectorAll('.tui-grid-header-area');
    headerAreas.forEach((headerArea) => {
      headerArea.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        const cell = e.target.closest('.tui-grid-cell-header');

        if (!cell) return;
        const columnName = cell.getAttribute('data-column-name');
        if (!columnName || columnName === '_number' || columnName === '_checked') return;

        // 2026.04.09[mhlim]: 목록 페이지 그리드 > 컬럼 고정 컨텍스트 노출
        if (props.declareParentType === 'list') {
          showContextMenu(e, columnName);
        }
      });
    });
  }

  // 외부 클릭 시 컨텍스트 메뉴 닫기
  document.addEventListener('click', hideContextMenu);

  // 2026.04.14 [mhlim]: 커스텀 설정 전체 컬럼 목록 초기 셋팅
  initialColumnList.value = [...modelOptions.value.columns];
  
  // 2026.04.13[mhlim]: 조회된 커스텀 컬럼 순으로 정렬 저장한 경우
  // -> 원본 전체 컬럼 배열과 비교하여 누락된 컬럼 값 추적하여 push 처리
  await Promise.all(props.initialColumns.map(async (column) => {
    if (!initialColumnList.value.find((item) => item.name === column.name)) {
      initialColumnList.value.push(column);
    }
  }));

  // 2023.08.29[jrjang]: 그리드 컬럼 값 가져오기
  gridColumns.value = initialColumnList.value;

  grid.value.on('onGridUpdated', async (ev) => {
    if (props.declareParentType === 'list') {
      const layerNodes = d3.selectAll('.column-freeze-layer');

      if (layerNodes.size() > 0) {
        layerNodes.remove();
      }

      if (grid.value.getData().length > 0) {
        // 그리드 데이터 및 레이아웃 refresh 후 컬럼 고정 레이어 생성
        await createFreezeLine();
      }
    }
  });

  makeHeaderInfoTooltip(); // 헤더 툴팁 호출
  makeEditTooltip(); // 수정툴팁 호출

  makeSetTooltip(); // 설정툴팁 호출

  makeSetCustom(); // 커스텀툴팁 호출

  makeStateTooltip(); // 상태툴팁 호출

  makeAttendanceInfo(); //출석률 산정 안내 호출

  // 2026.02.12[ygpark]: 텍스트 셀에 title 추가 (호버 시 전체 텍스트 표시)
  nextTick(applyEllipsisTitleToCells);

  const gridPagination = grid.value.getPagination();

  if (gridPagination) {
    let current = $search.getSearchPage();
    gridPagination.movePageTo(current);

    const perPage = grid.value.getPagination()._options.itemsPerPage;
    const totalItems = grid.value.getPagination()._options.totalItems;

    if (totalItems === 0) {
      current = 0;
    }

    pagination.value.current = current;
    pagination.value.perPage = grid.value.getPagination()._options.itemsPerPage;
    pagination.value.total = Math.ceil(totalItems / perPage);
  }

  setCheckboxValue();
});

watch(
  () => props.columnData,
  () => {
    setCheckboxValue();
    // 부모 상속 전체 컬럼 목록으로 초기 셋팅
    gridColumns.value = props.initialColumns;
  }
);

// 2023.09.06[cgnoh]: 노출갯수 변경 이벤트
const perPageChange = () => {
  const totalItems = grid.value.getPagination()._options.totalItems;
  const perPage = pagination.value.perPage;

  pagination.value.current = 1;
  pagination.value.total = Math.ceil(totalItems / perPage);

  grid.value.setPerPage(Number(pagination.value.perPage));
  grid.value.dispatch('updateRowSpan');
};

onUnmounted(() => {
  if (contextMenuEl.value) {
    document.body.removeChild(contextMenuEl.value);
    contextMenuEl.value = null;
  }
  document.removeEventListener('click', hideContextMenu);
});

onActivated(() => {
  if (grid.value) {
    grid.value.refreshLayout();

    const pagination = grid.value.getPagination();

    if (pagination) {
      pagination.movePageTo(pagination._currentPage);
    }
  }
});
</script>
<style lang="scss" scoped>
.check-list {
  margin: 0;

  &:first-child {
    .check-item {
      margin: 0;
    }
  }

  &-item {
    display: block;
    text-align: left;

    .check-item {
      margin: 15px 0 0 0;
    }

    &:last-child {
      margin: 0;
    }
  }
}

.grid-wrapper {
  position: relative;
}

:deep(
  .tui-grid-show-lside-area
    .tui-grid-lside-area
    .tui-grid-body-area
    .tui-grid-table
) {
  border-right-style: solid !important;
}

:global(.tui-grid-context-menu) {
  background: #fff;
  border: 1px solid #147C6C;
  border-radius: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 120px;

  .context-menu-item {
    padding: 8px 16px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
  }
}
</style>
