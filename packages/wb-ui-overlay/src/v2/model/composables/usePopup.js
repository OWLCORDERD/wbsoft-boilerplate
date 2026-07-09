export const usePopup = () => {
  // 팝업 활성화 여부
  const popupShow = useState('popup-v2:show', () => false);
  // 팝업 제목
  const popupTitle = useState('popup-v2:title');
  // 팝업 컨텐츠 영역 컴포넌트 경로
  const popupContentType = useState('popup-v2:contentType');

  const propsData = useState('popup-v2:propsData', () => null);

  const hasBtn = useState('popup-v2:hasBtn', () => false);
  const contBtn = useState('popup-v2:contBtn', () => false);
  const contTitle = useState('popup-v2:contTitle', () => false);

  const method = useState('popup-v2:method', () => null);

  // 2025.11.06[mhlim]: 팝업 호출(타이틀, 컨텐츠 셋팅 ~ 활성화 단계) 프로세스
  const show = ({
    title,
    contentType,
    props,
    hasBtnYn,
    contBtnYn,
    contTitleYn,
    emitFn = null,
  }) => {
    // 1. 팝업 타이틀
    popupTitle.value = title;
    // 2. 컨텐츠 영역 동적 컴포넌트 경로
    if (contentType !== '') {
      popupContentType.value = contentType;
    }

    if (contBtnYn) {
      contBtn.value = true;
    } else {
      contBtn.value = false;
    }

    if (contTitleYn) {
      contTitle.value = true;
    } else {
      contTitle.value = false;
    }

    if (typeof emitFn === 'function' && emitFn !== null) {
      method.value = emitFn;
    }

    // 3. 컨텐츠 영역 컴포넌트 바인딩 데이터
    if (props) {
      propsData.value = props;
    }

    // 4. 하단 버튼 유무
    if (hasBtnYn) {
      hasBtn.value = true;
    } else {
      hasBtn.value = false;
    }

    // 5. 팝업 활성화
    popupShow.value = true;
  };

  const close = () => {
    popupShow.value = false;
    popupContentType.value = '';
  };

  return {
    popupShow,
    popupTitle,
    popupContentType,
    propsData,
    show,
    close,
    hasBtn,
    contBtn,
    contTitle,
    method,
  };
};
