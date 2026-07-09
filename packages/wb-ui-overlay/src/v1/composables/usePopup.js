export const usePopup = () => {
  // 팝업 활성화 여부
  const popupShow = useState('popup:show', () => false);
  // 팝업 제목
  const popupTitle = useState('popup:title');
  // 팝업 컨텐츠 영역 컴포넌트 경로
  const popupContentType = useState('popup:contentType');

  const propsData = useState('popup:propsData', () => null);

  const hasBtn = useState('popup:hasBtn', () => false);

  const method = useState('popup:method', () => null);

  // 2025.11.06[mhlim]: 팝업 호출(타이틀, 컨텐츠 셋팅 ~ 활성화 단계) 프로세스
  const show = ({ title, contentType, props, hasBtnYn, emitFn = null }) => {
    // 1. 팝업 타이틀
    popupTitle.value = title;
    // 2. 컨텐츠 영역 동적 컴포넌트 경로
    if (contentType !== '') {
      popupContentType.value = contentType;
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
    method,
  };
};
