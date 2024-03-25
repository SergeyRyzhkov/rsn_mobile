import { resizeImage } from "../../_core/utils/MeduaUtils";
import { onMounted } from "vue";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";

export const usePhoto = () => {
  onMounted(() => {
    defineCustomElements(window);
  });

  return {
    getPhoto,
  };
};

const getPhoto = async (): Promise<string | null> => {
  if (Capacitor.isNativePlatform()) {
    const perm = await Camera.checkPermissions();
    if (perm.camera !== "granted" || perm.photos !== "granted") {
      const reqPromt = await Camera.requestPermissions();
      if (reqPromt.camera !== "granted" || perm.photos !== "granted") {
        return null;
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
  });

  if (!!image && !!image.webPath) {
    return image.webPath;
  }

  return null;
};
