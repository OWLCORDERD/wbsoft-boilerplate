// import { useLocalStorage } from '@vueuse/core';

// export default defineNuxtPlugin((nuxtApp) => {
//   const router = nuxtApp.$router;
//   const programmatic = useState(() => false);
//   const { $bus } = nuxtApp;
//   const { $menuList } = useNuxtApp();

//   ['push', 'replace', 'go', 'back', 'forward'].forEach((methodName) => {
//     const method = router[methodName];

//     router[methodName] = (...args) => {
//       programmatic.value = true;
//       const result = method.apply(router, args);

//       if (result instanceof Promise) {
//         return result.catch((error) => {
//           throw error;
//         });
//       }

//       return result;
//     };
//   });

//   // localStorage로 변경 (SSR-safe)
//   const tabs = useLocalStorage('saas_tab', []);

//   // 기존 쿠키 데이터 마이그레이션 (클라이언트에서만)
//   if (import.meta.client) {
//     const oldCookie = useCookie('saas_tab');
//     if (oldCookie.value && Array.isArray(oldCookie.value) && oldCookie.value.length > 0) {
//       if (!tabs.value || tabs.value.length === 0) {
//         tabs.value = [...oldCookie.value];
//       }
//       oldCookie.value = null; // 쿠키 삭제
//     }
//   }

//   const getMenuInfo = (_url) => {
//     // const { data: menuList } = useNuxtData('menuList');

//     if ($menuList.value) {
//       for (const oneDepth of $menuList.value) {
//         if (oneDepth.menuUrl === _url) {
//           return oneDepth;
//         }

//         if (oneDepth._children) {
//           for (const twoDepth of oneDepth._children) {
//             if (twoDepth.menuUrl === _url) {
//               return twoDepth;
//             }

//             // 2025.07.17[mhlim]: 3depth 메뉴 추가
//             if (twoDepth._children) {
//               for (const threeDepth of twoDepth._children) {
//                 if (threeDepth.menuUrl === _url) {
//                   return threeDepth;
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   };

//   const set = (to) => {
//     let meta = to.meta.tab;

//     if (meta) {
//       for (const [key, value] of Object.entries(to.params)) {
//         meta = meta.replace(`{${key}}`, value);
//       }
//     } else {
//       meta = to.path;
//     }

//     for (let i = 0; i < tabs.value.length; i++) {
//       const tab = tabs.value[i];

//       if (tab.meta === meta) {
//         tab.url = to.fullPath;
//         return;
//       }
//     }

//     let menuInfo = getMenuInfo(meta);

//     // 최상위 폴더는 탭 정보 localStorage 저장 x -> 메뉴 네비게이션만 업데이트
//     if (menuInfo && menuInfo.menuType !== 'FOLDER' && menuInfo.isNavigation) {
//       tabs.value.push({
//         url: to.fullPath,
//         menu: menuInfo?.menuName ?? 'Unknown',
//         meta: menuInfo?.menuUrl ?? 'Unknown',
//         name: to.name,
//       });
//     }
//   };

//   const push = (to, from) => {
//     for (let i = 0; i < tabs.value.length; i++) {
//       const tab = tabs.value[i];

//       if (tab.url === from.fullPath) {
//         tab.url = to.fullPath;
//         return;
//       }
//     }
//   };

//   const deleteTab = (index) => {
//     tabs.value.splice(index, 1);
//   };

//   return {
//     provide: {
//       tab: {
//         tabs,
//         set,
//         push,
//         deleteTab,
//         programmatic,
//       },
//     },
//   };
// });
