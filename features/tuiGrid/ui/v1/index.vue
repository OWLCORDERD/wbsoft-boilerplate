<template>
  <lxp-skeleton-grid v-if="loading" />
  <client-only>
    <!-- 2025.03.10[ygpark]: 그리드 내부 툴팁 노출을 위함 gridVisible 값 추가(Boolean 타입) -->
    <lxp-toast-tui-grid
      v-show="!loading"
      v-if="mergedOptions && mergedOptions.columns.length > 0"
      v-model:options="mergedOptions"
      :grid-id="gridId"
      :grid-visible="gridVisible"
      :declareParentType="declareParentType"
      :gridData="gridData"
      :pageType="pageType"
      :noData="noData"
      :columnData="columnData"
      :initialColumns="props.options.columns"
      @get-grid="getGrid"
      @get-drop-data="getDropData"
      @get-click-data="getClickData"
      @load-grid-column="loadGridColumn"
    />
  </client-only>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';

const route = useRoute();
const loading = ref(true); // 로딩 여부

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  gridId: Number,
  gridVisible: Boolean,
  gridData: Array,
  noData: String,
  pageType: String,
  // 그리드 컴포넌트 선언 부모 유형 (ex) 목록 > 'list')
  declareParentType: {
    type: String,
    default: '',
  },
});

const columnData = ref();
const mergedOptions = ref();
const reorderOptions = ref();

// 2026.04.10[mhlim]: 그리드 고유 식별자 아이디에 대한 커스텀 설정 조회
const loadGridColumn = async () => {
  // 그리드 고유 식별자 아이디가 존재하는 경우만 조회 처리
  if (props.gridId !== undefined) {
    // 그리드 고유 식별자 아이디를 포함한 엔드포인트 지정
    const endpoint = `/grid/${props.gridId}/user/column`;

    try {
        const response = await useWbFetch(endpoint, {
          baseURL: 'education',
          method: 'GET',
        });
      
        if ((response as any).success) {
          columnData.value = (response as any).data;
        }

        // 조회된 커스텀 컬럼 설정이 존재하는 경우 상속 옵션 내부 컬럼 배열 업데이트
        if (columnData.value && columnData.value.length > 0) {
          const reorderVisibleColumns: any[] = []; // 현재 조회된 커스텀 컬럼들만 정렬
          
          // 조회된 커스텀 컬럼 순으로 상속 옵션 내부 컬럼 배열 재정렬
          await Promise.all(columnData.value.map(async (columnData: any) => {
            return await Promise.all(props.options.columns.map(async (column: any) => {
              if (columnData.includes(column.name)) {
                reorderVisibleColumns.push(column);
              }
            }));
          }));

          reorderOptions.value = {
            ...props.options,
            columns: reorderVisibleColumns,
          }

          // 커스텀 설정 여부에 따른 최종 그리드 생성 옵션 값 셋팅
          mergedOptionSetting('Y');
        } else {
          // 조회된 커스텀 컬럼 설정이 빈값인 경우 상속받은 옵션으로 바로 셋팅
          mergedOptionSetting('N');
        }
    } catch (err) {
      // 그리드 고유 식별자 아이디가 존재하지 않는 경우 상속받은 옵션으로 바로 셋팅
      mergedOptionSetting('N');
    }
  } else {
    // 그리드 고유 식별자 아이디가 존재하지 않는 경우 상속받은 옵션으로 바로 셋팅
    mergedOptionSetting('N');
  }

  return true;
}

// 2026.04.10 [mhlim]: 커스텀 설정 여부에 따른 최종 그리드 생성 옵션 값 셋팅
// -> 기본 옵션과 사용자 정의 옵션을 병합
const mergedOptionSetting = (customYn: string) => {
  let customOptions = null;

  if (customYn === 'Y') {
    customOptions = reorderOptions.value;
  } else {
    customOptions = props.options;
  }

  const settingColumn = {
    header: '설정화 여부',
    name: 'hasSetting',
    width: 40,
    align: 'center',
  }
  
  // 2026.04.08[mhlim]: 전체 그리드 공통 > 컬럼 노출 설정화 여부 컬럼 기본 추가
  const includeSettingColumns = [...customOptions.columns, settingColumn];

  const defaultOptions: any = {
    columns: [],
    scrollY: false,
    columnOptions: {
      resizable: true,
    },
  };

  if (props.declareParentType === 'list') {
    defaultOptions.columns = includeSettingColumns?.map((column: any) => ({
      ...column,
      ...(column.header === '설정화 여부'
        ? {}
        : { sortable: !column.sortable ? false : true, defaultValue: '-' }),
      ...(column.align ? {} : { align: 'center' }),
    }));
  } else {
    defaultOptions.columns = customOptions.columns?.map((column: any) => ({
      ...column,
      ...(column.header === '설정화 여부'
        ? {}
        : { sortable: !column.sortable ? false : true, defaultValue: '-' }),
      ...(column.align ? {} : { align: 'center' }),
    }));
  }

  mergedOptions.value = {
    ...customOptions,
    ...defaultOptions,
    columnOptions: {
      ...defaultOptions.columnOptions,
      ...customOptions?.columnOptions,
    },
  };
}

const emit = defineEmits(['getGrid', 'getDropData', 'getClickData']);

const getGrid = (grid: object) => {
  loading.value = false;
  emit('getGrid', grid);
};

const getDropData = (ev: object) => {
  emit('getDropData', ev);
};

const getClickData = (ev: object) => {
  emit('getClickData', ev);
};

onActivated(async () => {
  if (props.declareParentType === 'list') {
    await loadGridColumn();
  }
});

onMounted(async () => {
  // 목록 페이지 그리드의 경우 커스텀 컬럼 설정 조회 처리
  if (props.declareParentType === 'list') {
    await loadGridColumn();
  } else {
    // 그 외의 페이지는 부모 상속 옵션 그대로 셋팅
    mergedOptionSetting('N');
  }
});
</script>
