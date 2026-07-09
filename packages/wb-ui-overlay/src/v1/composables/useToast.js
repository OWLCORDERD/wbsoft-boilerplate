export const useToast = () => {
  const toastShow = useState('toast:show', () => false);
  const toastText = useState('toast:text');
  let timeout;

  const show = (text) => {
    toastText.value = text;
    toastShow.value = true;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      toastShow.value = false;
    }, 1500);
  };

  return {
    toastShow,
    toastText,
    show,
  };
};
