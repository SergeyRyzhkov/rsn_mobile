<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import TheTopMenu from "@/layouts/components/TheTopMenu.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { FirebaseStorage } from "@/modules/firebase/FirebaseStorage";
import { usePhoto } from "@/modules/capacitor/usePhoto";
import { useFilePicker } from "@/modules/capacitor/useFilePicker";
import { useSpeechRecognition } from "@/modules/capacitor/useSpeechRecognition";
import { convertBase64ToBlob, convertImageToBlob, resizeImage } from "@/_core/utils/MeduaUtils";
import useModal from "@/_core/components/modal/useModal";
import CreateAlarmDialog from "@/modules/alarms/components/CreateAlarmDialog.vue";

const camera = usePhoto();
const fireBaseStorage = new FirebaseStorage();
const filePicker = useFilePicker();
const { start, stop, listeningState } = useSpeechRecognition();

const openCamera = async () => {
  const imgSrc = await camera.getPhoto();
  const blob = !!imgSrc ? await convertImageToBlob(imgSrc) : null;
  if (!!blob) {
    fireBaseStorage.uploadFile("images/test1.jpeg", blob);
  }
};

const modal = useModal();

const openFiles = async () => {
  modal.show(CreateAlarmDialog);
};

const pickVideos = async () => {
  await filePicker.pickVideos();
};

const pickImages = async () => {
  const res = await filePicker.pickImages();
  if (!!res.files[0].data) {
    const blob1 = convertBase64ToBlob(res.files[0].data, res.files[0].mimeType);
    const url = (window.webkitURL || window.URL).createObjectURL(blob1);
    const blob = await resizeImage(url);
    if (!!blob) {
      fireBaseStorage.uploadFile("images/test2.jpeg", blob);
    }
  }
};

const startVoiceRecording = async () => {
  start((matches: string[]) => {
    console.log(matches);
  });
};
</script>

<template>
  <BasePage class="bg-page-bg">
    <!-- <template #header>
      <header class="page-header">
        {{ listeningState }}
      </header>
    </template> -->
    <template #content>
      <div class="mb-[16px] mt-[20px]">
        <div class="container">
          <TheTopMenu></TheTopMenu>
        </div>
        <section class="flex flex-col m-auto relative max-h-[40vh] h-[40vh] mt-[42px]">
          <img src="/images/main_page.png" alt=" " class="object-contain z-40 h-full" />
        </section>

        <div class="container">
          <BaseButton class="mt-[32px]" @click="openCamera">openCamera</BaseButton>
          <BaseButton class="mt-[32px]" @click="openFiles">SOS</BaseButton>
          <BaseButton class="mt-[32px]" @click="pickVideos">pickVideos</BaseButton>
          <BaseButton class="mt-[32px]" @click="pickImages">pickImages</BaseButton>
          <BaseButton class="mt-[32px]" @click="startVoiceRecording">start recordVoice</BaseButton>
          <!-- <TheBottomActions></TheBottomActions> -->
        </div>
      </div>
    </template>
  </BasePage>
</template>
