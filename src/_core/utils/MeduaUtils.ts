import Reducer from "image-blob-reduce";

export const convertImageToBlob = async (src: string) => {
  const response = await fetch(src!);
  return await response.blob();
};

export const convertBase64ToBlob = (base64String: string, mimeType: string) => {
  const byteArray = Uint8Array.from(
    atob(base64String)
      .split("")
      .map((char) => char.charCodeAt(0)),
  );
  return new Blob([byteArray], { type: mimeType });
};

export const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });

const reducer = Reducer();

export const resizeImage = (src: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = src;

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
};
