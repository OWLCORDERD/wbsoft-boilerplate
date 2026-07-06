export default defineNuxtPlugin(async (NuxtApp) => {
  // 2026.03.13 [mhlim]: 현재 프로젝트 하위 플랫폼 경로 추출
  const currentPlatform = computed(() => {
    return NuxtApp._route.fullPath.includes('/education') ? '/education' : NuxtApp._route.fullPath.includes('/evaluation') ? '/evaluation' : NuxtApp._route.fullPath.includes('/material') ? '/material' : '/';
  });
  
  // 플랫폼별 최종 테마 색상 코드
  const colorCode = useCookie('colorCode', {
    default: () => '147c6c',
    path: currentPlatform.value,
    maxAge: 60 * 60 * 24 * 365 * 2,
    decode(value) {
      return decodeURIComponent(value).toString();
    },
  });

  // 사용자가 다른 테마 선택한 경우 저장되는 테마 색상 코드
  const userSelectColorCode = useCookie('userColorCode', {
    default: () => null,
    path: currentPlatform.value,
    maxAge: 60 * 60 * 24 * 365 * 2,
    decode(value) {
      return decodeURIComponent(value).toString();
    },
  })

  const colorType = useCookie('colorType', {
    default: () => 'theme',
    path: currentPlatform.value,
    maxAge: 60 * 60 * 24 * 365 * 2,
  })

  // 색상적용 기본 테마 코드 배열
  const defaultColorSet = [
    {
      type: 'Navy',
      title: '인디고블루',
      color: ['3d4282', '4a509f', '6e73b2', 'f2f3f8'],
    },
    {
      type: 'Purple',
      title: '바이올렛',
      color: ['4d338a', '6644b6', '8569c5', 'f4f2fa'],
    },
    {
      type: 'Bule',
      title: '코발트블루',
      color: ['27428f', '345abf', '5d7bcc', 'f1f3fa'],
    },
    {
      type: 'SeaGreen',
      title: '씨그린',
      color: ['105e51', '147c6c', '439689', 'F2FDFB'],
    },
    {
      type: 'SpringGreen',
      title: '스프링그린',
      color: ['006D00', '008900', '32A832', 'F5FFF5'],
    }
  ];

  const font = useCookie('font', {
    default: () => 'khnpHanulrim',
    maxAge: 60 * 60 * 24 * 365 * 2,
  });

  const themeColorSelector = () => {
    // 사용자가 선택한 색상 테마 코드 적용
    if (userSelectColorCode.value !== null) {
      colorCode.value = userSelectColorCode.value;
    } else {
      // 사용자가 선택한 색상 테마가 없는 경우, 기본 플랫폼별 색상 부여
      // 2025.12.02[mhlim]: 페이지 라우트 시작 경로에 따라 테마 색상 코드 변경 
      if (NuxtApp._route.path.startsWith('/education')) {
        colorCode.value = '147c6c';
      } else if (NuxtApp._route.path.startsWith('/evaluation')) {
        colorCode.value = '345abf';
      } else if (NuxtApp._route.path.startsWith('/material')) {
        colorCode.value = '4a509f';
      }
    }
  }
  
  return {
    provide: {
      homepage: { colorCode, font, colorType, userSelectColorCode, defaultColorSet, themeColorSelector },
    },
  };
});
