<template>
  <transition name="fade">
    <div class="modal" v-if="alertShow" :class="{'is-show': alertShow}">
      <div class="modal-container type02 is-alert">
        <div class="modal-header">
          <button type="button" class="btn-close" @click="close"><i class="icon" /></button>
          <i class="fi-bulb" />
          <!-- 2025.09.08[njlee]: 제목이 없는 경우 렌더링 하지 않도록 수정 -->
          <p class="title" v-html="alertTitle" v-if="hasTitle"></p>
          <!-- <p class="title">{{ alertTitle }}</p> -->
        </div>
        <!-- 2025.09.08[njlee]: 내용이 없는 경우 렌더링 하지 않도록 수정 -->
        <div class="modal-cont" v-if="alertText || hasBorder">
          <p v-html="alertText" v-if="alertText && !hasBorder"></p>
          <!-- {{ alertText }} -->
          <div class="modal-cont-border" v-if="hasBorder">
            <p v-html="alertText" v-if="alertText"></p>
            <ul v-if="alertSubTexts && alertSubTexts.length > 0">
              <li v-for="item in alertSubTexts" :key="item">
                <div class="border-item">
                  <div class="check-icon">
                    <svgo-common-check-wheel-icon filled/>
                  </div>
                  <p v-html="item.text"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <div class="btn-wrap">
            <div class="btn-group">
              <button type="button" title="확인" class="btn-main" @click="close">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
const { alertShow, alertTitle, alertText, close, hasTitle,hasBorder,alertSubTexts} = useAlert();
</script>

<style lang="scss" scoped>
@import '@/assets/scss/lxp/components/modal.scss';

</style>