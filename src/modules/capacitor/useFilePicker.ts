import { FilePicker } from "@capawesome/capacitor-file-picker";

// await Filesystem.requestPermissions();
const pickFiles = async () => {
  return await FilePicker.pickFiles({
    // types: ["image/png"],
    multiple: true,
    readData: true,
  });
};

const pickImages = async () => {
  return await FilePicker.pickImages({
    multiple: true,
    readData: true,
  });
};

const pickMedia = async () => {
  return await FilePicker.pickMedia({
    multiple: true,
    readData: true,
  });
};

const pickVideos = async () => {
  return await FilePicker.pickVideos({
    multiple: true,
    readData: true,
  });
};

export const useFilePicker = () => {
  return {
    pickFiles,
    pickImages,
    pickMedia,
    pickVideos,
  };
};
