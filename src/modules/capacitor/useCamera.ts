import { resizeImage } from "./../../_core/utils/ImageUtils";
import { onMounted } from "vue";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Guid } from "@/_core/utils/Guid";
import Reducer from "image-blob-reduce";

export const useCamera = () => {
  onMounted(() => {
    defineCustomElements(window);
  });

  return {
    getPhoto,
  };
};

const reducer = Reducer();

const getPhoto = async (): Promise<Blob | null | undefined> => {
  if (Capacitor.getPlatform() !== "web") {
    const perm = await Camera.checkPermissions();
    if (perm.camera !== "granted" || perm.photos !== "granted") {
      const reqPromt = await Camera.requestPermissions();
      if (reqPromt.camera !== "granted" || perm.photos !== "granted") {
        return;
      }
    }
  }

  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    promptLabelPicture: "Сделать фотографию",
    promptLabelPhoto: "Выбрать из галереи",
    promptLabelHeader: "Фотография",
    promptLabelCancel: "Отмена",
    correctOrientation: false,
  });

  if (!!image && !!image.webPath) {
    return resizeImage(image.webPath);
  }
  Promise.resolve(null);
};
