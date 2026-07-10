export default defineNuxtPlugin(async (nuxtApp) => {
  const { $auth } = useNuxtApp();
  const route = useRoute();
  const config = useRuntimeConfig();

  const menuList = useState('menuList', () => []);

  const getNavigationMenu = async () => {
    // 2026.02.09 [mhlim]: 비로그인 default 전체 네비게이션 조회 API 경로
    const endpoint = `${config.public.apiBaseUrl}/api/menuList`;
    
    // 2026.02.09 [mhlim]: 로그인 사용자 전용 네비게이션 목록 조회
    if ($auth && $auth.isLogin?.value) {
      // 2026.06.12 [송성욱]: SSR에서 만료/누락 토큰으로 my-tree 401이 발생하면
      // 미처리 throw가 SSR 렌더 전체를 중단시켜 error.vue("잠시 후 다시 시도해주세요")로 빠진다.
      // 네비게이션 조회 실패는 빈 메뉴로 degrade하고, 토큰 갱신/재조회는
      // 클라이언트 하이드레이션 시 useWbFetch 클라이언트 분기(validate/refresh)가 처리한다.
      try {
        const menuResponse = await useWbFetch(endpoint, {
          method: 'GET',
        });

        menuList.value = menuResponse?.success ? menuResponse.data : [];
      } catch (e) {
        console.warn('[menuList] my-tree 네비게이션 조회 실패 (빈 메뉴로 degrade):', e?.message || e);
        menuList.value = [];
      }
    } else {
      // 2026.02.09 [mhlim]: 비로그인 default 전체 네비게이션 목록 조회
      const menuResponse = await $fetch(endpoint, {
        method: 'GET',
      });
  
      if (menuResponse.success) {
        menuList.value = menuResponse.data;
      } else {
        menuList.value = [];
      }
    }
  };

  // // 2025.09.23 [mhlim]: 첫 세션 로그인 이후 네비게이션 조회
  // if ($auth.isLogin.value && typeof window !== 'undefined') {
  //     await getNavigationMenu();
  //   }

  // 2026.02.08[ygpark]: 로그인 후 네비게이션 조회
  if ($auth?.isLogin?.value) await getNavigationMenu();

  return {
    provide: {
      menuList: menuList,
      navigationReload: getNavigationMenu,
    },
  };
});
