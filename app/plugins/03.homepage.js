export default defineNuxtPlugin(async (NuxtApp) => {
  // 플랫폼별 최종 테마 색상 코드
  const colorCode = useCookie('colorCode', {
    default: () => '4a509f',
    maxAge: 60 * 60 * 24 * 365 * 2,
    decode(value) {
      return decodeURIComponent(value).toString();
    },
  });

  // 사용자가 다른 테마 선택한 경우 저장되는 테마 색상 코드
  const userSelectColorCode = useCookie('userColorCode', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365 * 2,
    decode(value) {
      return decodeURIComponent(value).toString();
    },
  })

  const colorType = useCookie('colorType', {
    default: () => 'theme',
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
  ];

  const font = useCookie('font', {
    default: () => 'pretendard',
    maxAge: 60 * 60 * 24 * 365 * 2,
  });

  const themeColorSelector = () => {
    // 사용자가 선택한 색상 테마 코드 적용
    if (userSelectColorCode.value !== null) {
      colorCode.value = userSelectColorCode.value;
    }
  }
  
  return {
    provide: {
      homepage: { colorCode, font, colorType, userSelectColorCode, defaultColorSet, themeColorSelector },
    },
  };
});
