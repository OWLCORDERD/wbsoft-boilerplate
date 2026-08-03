<template>
    <div class="image-gallery">
        <div
            v-for="(icons, section) in currentSvgList"
            :key="section"
            class="section"
        >
            <div class="header">
                <h3>{{ section }}</h3>
            </div>
            <div class="images" v-if="svgOpenStates[section]">
                <button
                    type="button"
                    v-for="(icon, index) in icons"
                    :key="index"
                    class="box"
                    @click="copyImageUrl(icon.fullPath)"
                >
                <component :is="icon.path" class="item" />
                <p class="name">{{ icon.name }}</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const svgOpenStates = ref<Record<string, boolean>>({});

// 2025.05.16 [mhlim]: 프로젝트 svg 이미지들이 저장된 루트 폴더
const svgFolders = import.meta.glob(
  '@/assets/lxp/images/svg/*/*.svg',
  {
    eager: true,
  }
); // 하위 폴더들 가져오기

interface imageListItem {
  path: string;
  fullPath: string;
  name: string;
}

// 2025.08.20 [mhlim]: 프로젝트 내부 svg 이미지 폴더 구조 데이터 세팅
const currentSvgList = computed(() => {
  let imageListSections: Record<string, any> = {};
  // 폴더별로 이미지를 정리
  Object.keys(svgFolders).forEach((key) => {
    const fullPathArray = String(key).split('/');
    const fileFolder = fullPathArray[fullPathArray.length - 2];
    let folder = `${fileFolder}`; // 폴더 이름 추출

    switch (folder) {
      case 'Button':
        folder = '버튼 아이콘';
        break;
      case 'GNB':
        folder = 'GNB depth1 아이콘';
        break;
      case 'DetailInfo':
        folder = '상세 정보 아이콘';
        break;
    }

    if (!imageListSections[folder as string]) {
      imageListSections[folder as string] = [];
    }

    // 현재 폴더 이름 키값으로 펼침 활성화 상태 저장
    if (!svgOpenStates.value[folder as string]) {
      svgOpenStates.value[folder as string] = true;
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

// 복사 로직
const copyImageUrl = (data: string) => {
  var t = document.createElement('textarea');
  document.body.appendChild(t);
  t.value = data;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);

  useToast().show(
    `이미지 컴포넌트가 복사되었습니다. → ${t.value?.split('<')[1]?.split('/>')[0]}`
  );
};
</script>

<style lang="scss" scoped>
      // svg 디렉토리 관리 영역
      .image-gallery {
        display: flex;
        flex-direction: column;
        gap: 20px;

        & .section {
          display: flex;
          flex-direction: column;
          padding: 10px;

          & .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background-color: var(--colorMain);
            backdrop-filter: blur(1px);
            --webkit-backdrop-filter: blur(1px);

            
            .toggle-btn {
              text-decoration: underline;
              font-weight: bold;
            }
          }

          & .images {
            display: flex;
            flex-wrap: wrap;

            & .box {
              display: flex;
              flex-direction: column;
              align-items: center; /* 이미지를 수직 중앙 정렬 */
              width: 120px; /* 이미지 및 텍스트를 담을 적당한 크기 지정 */
              justify-content: space-between; /* 이미지와 텍스트 간 여백 추가 */
              //   text-align: center;
              cursor: pointer;
              padding: 10px;
              gap: 10px;
              border: 2px solid transparent;

              .nuxt-icon {
                  color: #fff;
              }

              &:hover {
                background-color: rgba(255, 255, 255, 0.05);
                border-color: #fff;
              }

              & .item {
                width: 50px;
                height: 50px;
                object-fit: contain;
                align-items: center;
                justify-content: center;
                display: flex;
              }

              & .name {
                width: 100%;
                height: 40px;
                font-size: 12px;
                word-wrap: break-word;
                font-weight: bold;
                text-align: center;
                color: #fff;
              }
            }
          }
        }
      }
</style>