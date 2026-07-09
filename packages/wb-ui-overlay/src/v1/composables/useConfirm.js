// 브라우저 뒤로/앞으로가기(popstate) 시 열린 confirm을 한 번만 구독해 닫음
// let confirmPopstateRegistered = false;

export const useConfirm = () => {
  const confirmShow = useState('confirm:show', () => false);
  const message = useState('confirm:message');
  const confirmText = useState('confirm:text');
  const subMsg = useState('confirm:subMsg');
  const subTitle = useState('confirm:subTitle');
  const cancelText = useState('confirm:cancel');
  const _resolve = useState('confirm:resolve');
  const hasTitle = useState('confirm:hasTitle', () => true);
  //2025.10.20[njlee]: border 및 subTexts 옵션 추가
  const hasBorder = useState('confirm:hasBorder', () => false);
  const confirmSubTexts = useState('confirm:subTexts', () => []);
  // 2026.02.17[mhlim]: 제목 메시지 영역 라벨 디자인 추가 여부
  const hasTitleLabel = useState('confirm:hasTitleLabel', () => false);
  const labelTitle = useState('confirm:labelTitle', () => '');
  // 2026.02.21[mhlim]: 모달 컨테이너 너비 제한 옵션 추가
  const containerWidth = useState('confirm:containerWidth', () => null);

  // 2025.XX.XX[작성자]: 테이블 옵션 추가
  const hasTable = useState('confirm:hasTable', () => false);
  const tableData = useState('confirm:tableData', () => []);
  // 2026.02.25[mhlim]: 정합성 오류 테이블 스크롤 옵션 추가
  const tableScrollYn = useState('confirm:tableScrollYn', () => false);

  // 2025.XX.XX[작성자]: 취소 버튼 표시 여부 옵션 추가
  const hasCancel = useState('confirm:hasCancel', () => true);

  // 2026.06.16: 설문모달 전용 클래스
  const surveyClass = useState('confirm:surveyClass', () => '');

  // 2025.11.19[mhlim]: 호출 선언 부모 페이지 props 함수 옵션 추가
  const method = useState('confirm:method');

  // 2026.07.03: 라디오 버튼 옵션 추가
  const hasRadio = useState('confirm:hasRadio', () => false);
  const radioOptions = useState('confirm:radioOptions', () => []);
  const selectedRadio = useState('confirm:selectedRadio', () => null);

  // const dismissAsCancel = () => {
  //   confirmShow.value = false;

  //   if (_resolve.value) {
  //     _resolve.value(false);
  //   }

  //   if (labelTitle.value && labelTitle.value !== '') {
  //     labelTitle.value = '';
  //     hasTitleLabel.value = false;
  //   }
  // };

  // const registerPopstateCloseOnce = () => {
  //   if (confirmPopstateRegistered) return;
  //   if (import.meta.server || typeof window === 'undefined') return;
  //   confirmPopstateRegistered = true;
  //   window.addEventListener('popstate', () => {
  //     if (!confirmShow.value) return;
  //     dismissAsCancel();
  //   });
  // };

  // registerPopstateCloseOnce();

  const show = (obj) => {
    // 2026.02.21[mhlim]: 기존 호출된 모달 옵션 중복 캐싱 방지 위한 초기화
    confirmShow.value = false;
    message.value = '';
    confirmText.value = '';
    subMsg.value = '';
    subTitle.value = '';
    cancelText.value = '';
    _resolve.value = null;
    hasTitle.value = true;
    hasBorder.value = false;
    confirmSubTexts.value = [];
    hasTitleLabel.value = false;
    labelTitle.value = '';

    containerWidth.value = null;

    hasTable.value = false;
    tableData.value = [];

    hasCancel.value = true;
    method.value = null;
    tableScrollYn.value = false;
    surveyClass.value = '';
    hasRadio.value = false;
    radioOptions.value = [];
    selectedRadio.value = null;

    if (typeof obj === 'string') {
      message.value = obj;
      confirmShow.value = true;

      confirmText.value = '확인';
      cancelText.value = '취소';
      //2025.10.20[njlee]: border 및 subTexts 기본값 설정
      hasBorder.value = false;
      confirmSubTexts.value = [];
      // 2025.XX.XX[작성자]: 테이블 옵션 기본값 설정
      hasTable.value = false;
      tableData.value = [];
      hasCancel.value = true;
    } else if (typeof obj === 'object') {
      confirmText.value = obj.confirm;

      cancelText.value = obj.cancel ?? '취소';
      message.value = obj.message ?? '확인';
      subMsg.value = obj.subMsg;
      subTitle.value = obj.subTitle;
      confirmShow.value = true;

      if (obj.tableScrollYn === 'Y') {
        tableScrollYn.value = true;
      }

      if (obj.containerWidth) {
        containerWidth.value = obj.containerWidth;
      }

      if (obj.method) {
        method.value = obj.method;
      }

      if (obj.hasTitle !== undefined) {
        if (obj.hasTitle) {
          hasTitle.value = true;

          // 제목 영역 라벨 디자인 추가
          if (obj.hasTitleLabel) {
            hasTitleLabel.value = true;
            labelTitle.value = obj.labelTitle;
          }
        } else {
          hasTitle.value = false;
        }
      } else {
        hasTitle.value = true;
      }

      //2025.10.20[njlee]: border 및 subTexts,subTitle 옵션 추가
      hasBorder.value = obj.hasBorder !== undefined ? obj.hasBorder : false;
      confirmSubTexts.value = obj.subTexts !== undefined ? obj.subTexts : [];

      // 2025.XX.XX[작성자]: 테이블 옵션 추가
      hasTable.value = obj.hasTable !== undefined ? obj.hasTable : false;
      tableData.value = obj.tableData !== undefined ? obj.tableData : [];

      // 2025.XX.XX[작성자]: 취소 버튼 표시 여부 옵션 추가
      hasCancel.value = obj.hasCancel !== undefined ? obj.hasCancel : true;

      if (obj.surveyClass) {
        surveyClass.value = obj.surveyClass;
      }

      // 2026.07.03: 라디오 버튼 옵션 추가
      hasRadio.value = obj.hasRadio !== undefined ? obj.hasRadio : false;
      radioOptions.value = obj.radioOptions !== undefined ? obj.radioOptions : [];
      if (radioOptions.value.length > 0) {
        selectedRadio.value = radioOptions.value[0].value;
      }
    }

    return new Promise((resolve) => {
      _resolve.value = resolve;
    });
  };

  const cancel = () => {
    confirmShow.value = false;

    if (_resolve.value) {
      _resolve.value(false);
    }

    if (labelTitle.value && labelTitle.value !== '') {
      labelTitle.value = '';
      hasTitleLabel.value = false;
    }

    surveyClass.value = '';
  };

  const confirm = () => {
    confirmShow.value = false;

    if (_resolve.value) {
      // 부모 페이지 props 함수 실행
      if (method.value) {
        method.value();
      }
      // 라디오 버튼이 있는 경우 선택된 값을 반환
      if (hasRadio.value) {
        _resolve.value({ confirmed: true, selectedValue: selectedRadio.value });
      } else {
        _resolve.value(true);
      }
    }

    if (labelTitle.value && labelTitle.value !== '') {
      labelTitle.value = '';
      hasTitleLabel.value = false;
    }

    surveyClass.value = '';
  };

  // 2025.12.05[hglee]: confirm 창만 닫기 추가
  const close = () => {
    confirmShow.value = false;

    method.value = null;

    // 공통정의 19번 컨펌 출력시 close 버튼 클릭시 resolve 리턴
    // 2026.02.21[수정]: X 버튼 클릭 시 null 반환하도록 변경
    if (_resolve.value) {
      _resolve.value(null);
    }

    surveyClass.value = '';
  };

  return {
    confirmShow,
    message,
    subMsg,
    subTitle,
    confirmText,
    cancelText,
    show,
    cancel,
    close,
    confirm,
    hasTitle,
    hasBorder,
    confirmSubTexts,
    hasTable,
    tableData,
    hasCancel,
    hasTitleLabel,
    labelTitle,
    containerWidth,
    tableScrollYn,
    surveyClass,
    hasRadio,
    radioOptions,
    selectedRadio,
  };
};
