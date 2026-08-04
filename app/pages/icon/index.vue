<template>
  <div class="icon-gallery">
    <template v-for="(icons, section) in currentSvgList">
    <!-- ── Layers & Modules ───────────────────────────────────────────────── -->
      <DOCSSection :sectionId="section">
        <template #heading>
          <h2 class="section-heading">
            <div class="section-heading__title">
              <span class="section-heading__icon">📂</span>{{ section }}
            </div>
            <button type="button" aria-label="폴더 드롭다운 컨트롤버튼" class="toggle-btn" @click="toggleSection(section)">
              <svgo-Chevron-down v-if="!svgOpenStates[section]" />
              <svgo-Chevron-up v-else />
            </button>
          </h2>
        </template>

        <template #content>
          <DOCSArchitectureIconStructure
            ref="structureRef" 
            :section="section"
            :icons="icons"
            v-model="svgOpenStates"
          />
        </template>
        <!-- <template #heading>
          <h2 class="section-heading">
            <span class="section-heading__icon">🗂</span>레이어 & 모듈
          </h2>

          <p class="section__lead">
            아키텍처는 4개의 레이어로 구성되며, 화살표 방향으로만 의존성을 가집니다. 역방향 참조는 금지됩니다.
          </p>
        </template>

        <template #content>
          <DOCSArchitectureLayerDiagram :layerItems="LAYER_ITEMS" />
        </template> -->
      </DOCSSection>
    </template>
  </div>
</template>

<script lang="ts" setup>
export interface imageListItem {
  path: string;
  fullPath: string;
  name: string;
}

// 2025.05.16 [mhlim]: 프로젝트 svg 이미지들이 저장된 루트 폴더
const svgFolders = import.meta.glob(
  '@/assets/lxp/images/svg/*/*.svg',
  {
    eager: true,
  }
); // 하위 폴더들 가져오기

const svgOpenStates = ref<Record<string, boolean>>({});


// 2025.08.20 [mhlim]: 프로젝트 내부 svg 이미지 폴더 구조 데이터 세팅
const currentSvgList = computed(() => {
  let imageListSections: Record<string, any> = {};
  // 폴더별로 이미지를 정리
  Object.keys(svgFolders).forEach((key) => {
    const fullPathArray = String(key).split('/');
    const fileFolder = fullPathArray[fullPathArray.length - 2];
    let folder = `${fileFolder}`; // 폴더 이름 추출

    switch (folder) {
      case 'Button':     folder = '버튼 아이콘'; break;
      case 'GNB':        folder = 'GNB 네비게이션 아이콘'; break;
      case 'DetailInfo': folder = '상세 정보 아이콘'; break;
      case 'Floating':   folder = '플로팅 버튼 아이콘'; break;
      case 'Learner':    folder = '학습자 아이콘'; break;
      case 'Tab':        folder = '탭 아이콘'; break;
      case 'TableDepth': folder = '테이블 하위데이터 아이콘'; break;
      case 'TextField':  folder = '텍스트필드 아이콘'; break;
      case 'Priority':   folder = '우선순위 아이콘'; break;
      case 'Chevron':      folder = '화살표 아이콘'; break;
      case 'CourseDetail': folder = '과정 상세 아이콘'; break;
      case 'DragDrop': folder = '드래그 드롭 아이콘'; break;
      case 'ETC': folder = '기타 아이콘'; break;
      case 'FileExtension': folder = '파일 확장자 아이콘'; break;
      case 'Filter': folder = '필터 아이콘'; break;
      case 'HomeSetting': folder = '홈 설정 아이콘'; break;
      case 'Plan': folder = '요금제 아이콘'; break;
    }

    if (!imageListSections[folder]) {
      imageListSections[folder] = [];
    }

    const imagePath = (svgFolders[key] as any)?.default as string; // 이미지 경로
    const fileName = key.split('/').pop() as string; // 파일 이름 추출
    imageListSections[folder as string].push({
      path: imagePath, // 가이드 프로젝트 내부에 저장된 이미지 실제 경로 (썸네일용)
      // 복사 경로는 nuxt-svgo autoImport 경로에 맞춘 컴포넌트 이름으로 생성
      fullPath: `<svgo-${fileFolder}-${fileName.split('.')[0]} />`, // .svg 확장자 제거
      name: fileName, // 파일명
    } as imageListItem);
  });

  return imageListSections;
});

const toggleSection = (section: string) => {
  svgOpenStates.value[section] = !svgOpenStates.value[section];
}

// currentSvgList가 확정된 뒤 열림 상태를 초기화 (computed 내 side-effect 방지)
watch(currentSvgList, (list) => {
  Object.keys(list).forEach((folder) => {
    if (!(folder in svgOpenStates.value)) {
      svgOpenStates.value[folder] = false;
    }
  });
}, { immediate: true });
</script>

<style lang="scss" scoped>
.section-heading {
  justify-content: space-between;

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  & .toggle-btn {
    display: block;
    width: 30px;
    height: 30px;
    color: #fff;
  }
}

.icon-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>