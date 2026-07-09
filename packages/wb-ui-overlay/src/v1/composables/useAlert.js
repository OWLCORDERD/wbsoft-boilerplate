export const useAlert = () => {
    const alertShow = useState('alert:show', () => false);
    const alertTitle = useState('alert:title');
    const alertText = useState('alert:text');
    //2025.09.08[njlee]: 제목 옵션 추가
    //2025.11.13[njlee]: confirm을 alert로 오류 수정 
    const hasTitle = useState('alert:hasTitle', () => true);
    //2025.09.25[njlee]: border 및 subText 옵션 추가
    //2025.11.13[njlee]: confirm을 alert로 오류 수정 
    const hasBorder = useState('alert:hasBorder', () => false);
    const alertSubTexts = useState('alert:subTexts', () => []);

    const show = (title, text, showTitle, showBorder, subTexts) => {
        alertTitle.value = title;
        alertText.value = text;
        alertShow.value = true;
        document.querySelector('body').classList.add('is-fixed');
        //2025.09.08[njlee]: 제목 옵션 추가
        // showTitle이 undefined인 경우 기본값 true로 설정
        hasTitle.value = showTitle !== undefined ? showTitle : true;
        //2025.09.25[njlee]: border 및 subText 옵션 추가
        console.log('showBorder:', showBorder);
        hasBorder.value = showBorder !== undefined ? showBorder : false;
        console.log('hasBorder:', hasBorder.value);
        console.log('subTexts:', subTexts);
        alertSubTexts.value = subTexts !== undefined ? subTexts : [];
    }

    const close = () => {
        alertShow.value = false;
        document.querySelector('body').classList.remove('is-fixed');
    }

    return {
        alertShow,
        alertTitle,
        alertText,
        show,
        close,
        hasTitle,
        hasBorder,
        alertSubTexts,
    }
}