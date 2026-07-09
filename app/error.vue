<template>
    <div class="error">
      <div class="error-page">
        <div class="txt-area">
          <h2 class="title">{{ error.statusCode }}</h2>
          <div class="cont">
            <p>{{ error.message ?? '오류가 발생했습니다.' }}</p>
            <p>잠시 후 다시 시도해주세요.</p>
            <br />
            <p></p>
          </div>
        </div>
        <div class="img-area">
          <img src="@/assets/common/images/default/error.png" />
        </div>
      </div>
      <!--    <div class="error-btn">-->
      <!--      <div class="btn-wrap">-->
      <!--        <button type="button" class="btn-back" @click="router.back()">뒤로가기</button>-->
      <!--        <button type="button" class="btn-out" @click="$auth.logout">로그아웃</button>-->
      <!--      </div>-->
      <!--    </div>-->
    </div>
  </template>
<script lang="ts" setup>
import type { NuxtError } from '#app';

const { $auth } = useNuxtApp();
const router = useRouter();
const props = defineProps<{
    error: NuxtError;
}>();
</script>
<style lang="scss" scoped>
.error {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    &-page {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 56px;
      margin: 0 auto;
  
      .txt-area {
        .title {
          font-family: Roboto;
          font-size: 85px;
          color: #f16966;
          margin-bottom: 10px;
        }
  
        .cont {
          font-size: 17px;
          line-height: 1.4;
          font-weight: 600;
        }
      }
  
      .img-area {
        img {
          width: 335px;
        }
      }
    }
  
    &-btn {
      .btn-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 30px;
        gap: 10px;
  
        button {
          flex: 1;
          height: 40px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
  
          &.btn-back {
            border: 1px solid #ccc;
          }
  
          &.btn-out {
            background: #999;
            color: #fff;
          }
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    .error {
      width: 100%;
      padding: 20px;
  
      &-page {
        flex-direction: column;
        gap: 30px;
        width: 100%;
  
        .txt-area {
          text-align: center;
  
          .title {
            font-size: 60px;
          }
        }
  
        .img-area {
          max-width: 250px;
        }
      }
    }
  }
  </style>
  