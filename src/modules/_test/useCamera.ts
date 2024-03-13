import { onMounted } from "vue";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
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
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.id = Guid.newGuid();
      //@ts-ignore
      img.src = image.webPath;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // const scale_factor = env.opts.min / Math.min(env.image.width, env.image.height);
        // if (scale_factor > 1) scale_factor = 1;
        // env.transform_width = Math.max(Math.round(env.image.width * scale_factor), 1);
        // env.transform_height = Math.max(Math.round(env.image.height * scale_factor), 1);

        const aspect = 260 / img.width;
        canvas.width = 260;
        canvas.height = img.height * aspect;

        //@ts-ignore
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!!blob) {
              reducer
                .toBlob(blob, {
                  max: 4096,
                  unsharpAmount: 80,
                  unsharpRadius: 0.6,
                  unsharpThreshold: 2,
                })
                .then((newBlob) => {
                  resolve(newBlob);
                });
            }
            release();
          },
          "image/jpeg",
          0.8,
        );

        const release = () => {
          img?.parentElement?.removeChild(img);
          canvas?.parentElement?.removeChild(canvas);
        };
      };
    });
  }
  Promise.resolve(null);
};
