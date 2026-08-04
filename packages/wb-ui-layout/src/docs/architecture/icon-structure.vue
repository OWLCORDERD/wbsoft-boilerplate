<template>
  <Transition name="fade">
    <div class="images" v-if="model[section]">
      <button
          type="button"
          v-for="(icon, index) in icons"
          :key="index"
          class="box"
          @click="copyImageUrl(icon.fullPath)"
      >
      <component :is="icon.path" filled class="item" />
      <p class="name">{{ icon.name }}</p>
      </button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import type { imageListItem } from '~/pages/icon/index.vue';

const svgOpenStates = ref<Record<string, boolean>>({});

const props = defineProps<{
  section: string;
  icons: imageListItem[];
}>();

const model = defineModel<Record<string, boolean>>({ required: true });

// 복사 로직
const copyImageUrl = (data: string) => {
  const t = document.createElement('textarea');
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
    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 20px 10px;
      background-color: #fff;
      font-family: $font-pretendard;

      .box {
        display: flex;
        flex-direction: column;
        align-items: center; /* 이미지를 수직 중앙 정렬 */
        width: 120px; /* 이미지 및 텍스트를 담을 적당한 크기 지정 */
        justify-content: space-between; /* 이미지와 텍스트 간 여백 추가 */
        //   text-align: center;
        cursor: pointer;
        gap: 20px;
        padding: 10px 20px;
        border: 5px solid transparent;

        & .item {
          width: fit-content;
          height: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &:hover {
          border: 5px solid var(--colorMain);
        }

        & .name {
          width: 100%;
          height: 40px;
          font-size: 12px;
          word-wrap: break-word;
          font-weight: bold;
          text-align: center;
        }
      }
    }
</style>