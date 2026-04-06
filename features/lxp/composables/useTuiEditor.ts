import Editor from "@toast-ui/editor";
import "@toast-ui/editor/toastui-editor.css";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "~/server/firestore";

export const toastEditorInstance = (
  el: HTMLElement,
  initialEditType: string,
  defaultOptions: any,
  height: string,
  initialValue: string
) => {
  return new Editor({
    el: el,
    initialEditType: initialEditType,
    options: defaultOptions,
    height: height,
    initialValue: initialValue,
    hooks: {
      async addImageBlobHook(
        blob: File,
        callback: (url: string, altText?: string) => void
      ) {
        try {
          const fileName = `${Date.now().toString()}_${blob.name}`;
          const storageRef = ref(storage, `/memo/${fileName}`);

          const uploadSnapshot = await uploadBytes(storageRef, blob);
          const uploadUrl = await getDownloadURL(uploadSnapshot.ref);

          callback(uploadUrl, blob.name);

          alert("이미지 업로드에 성공하였습니다.");
        } catch (err) {
          console.log(err);
        }
      },
    },
  });
};
