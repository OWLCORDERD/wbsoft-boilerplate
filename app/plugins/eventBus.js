import { ref } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const eventBus = ref({});

  const emit = (event, data) => {
    if (eventBus.value[event]) {
      eventBus.value[event].forEach(callback => callback(data));
    }
  };

  const on = (event, callback) => {
    if (!eventBus.value[event]) {
      eventBus.value[event] = [];
    }
    eventBus.value[event].push(callback);
  };
  const off = (event, callback) => {
    if (eventBus.value[event]) {
      eventBus.value[event] = eventBus.value[event].filter(cb => cb !== callback);
    }
  };

  nuxtApp.provide('bus', {
    emit,
    on,
    off,
  });
});