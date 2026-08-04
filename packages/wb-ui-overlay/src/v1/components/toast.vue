<template>
  <transition name="fade">
    <div
      class="toast-modal"
      v-if="toastShow"
      :class="{ kiosk: isKiosk, rookie: isRookie }"
    >
      <svgo-GNB-info filled />
      <p class="txt" v-html="toastText"></p>
    </div>
  </transition>
</template>

<script setup>
const { toastShow, toastText } = useToast();
const route = useRoute();

const isKiosk = computed(() => {
  return route.path.startsWith('/kiosk');
});

const isRookie = computed(() => {
  return (
    route.path.startsWith('/kiosk/rookie') || route.query.target === 'rookie'
  );
});
</script>
