export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n;
  const data = useState(() => {
    return {};
  });

  // const _data = await useWbFetch('/common/locale/i18n/load', {
  //   baseURL: 'lxp',
  // }).catch(() => {
  //   return {};
  // });

  // data.value = _data.data;

  if (data.value) {
    // console.log(data.value)
    for (const key of Object.keys(data.value)) {
      i18n.setLocaleMessage(key, data.value[key].locales);
    }
  }
});
