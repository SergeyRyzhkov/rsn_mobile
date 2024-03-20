<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import TheTopMenu from "@/layouts/components/TheTopMenu.vue";
import TheBottomActions from "@/layouts/components/TheBottomActions.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { FirebaseStorage } from "@/modules/firebase/FirebaseStorage";
import { useCamera } from "@/modules/capacitor/useCamera";
import { useFilePicker } from "@/modules/capacitor/useFilePicker";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "@/modules/alarms/services/AlarmEventService";

const camera = useCamera();
// const geolocation = useGeolocation();

const filePicker = useFilePicker();

const openCamera = async () => {
  const blob = await camera.getPhoto();
  if (!!blob) {
    // fireBaseStorage.uploadFile("images/test1.jpeg", blob);
  }
};

const openFiles = async () => {
  const res = await filePicker.pickFiles();
  alert(res.files[0].data);
};

const pickVideos = async () => {
  await filePicker.pickVideos();
};

const pickImages = async () => {
  const res = await filePicker.pickImages();
  // console.log(res.files);
  console.log(res.files[0].data);
};
</script>

<template>
  <BasePage class="bg-page-bg">
    <template #header>
      <header class="page-header">
        <div class="flex items-center justify-between container text-white font-medium">
          Тут будет описание, <br />
          текущая погода <br />
          быстрые контакты <br />
          и проча хрень
        </div>
      </header>
    </template>
    <template #content>
      <div class="mb-[16px] mt-[20px]">
        <div class="container">
          <TheTopMenu></TheTopMenu>
        </div>
        <section class="flex flex-col my-auto relative max-h-[50vh] h-[50vh]">
          <img src="/images/main_page.png" alt=" " class="object-contain z-40 h-full" />
        </section>

        <div class="container">
          <BaseButton class="mt-[32px]" @click="openCamera">openCamera</BaseButton>
          <BaseButton class="mt-[32px]" @click="openFiles">openFiles</BaseButton>
          <BaseButton class="mt-[32px]" @click="pickVideos">pickVideos</BaseButton>
          <BaseButton class="mt-[32px]" @click="pickImages">pickImages</BaseButton>
          <!-- <TheBottomActions></TheBottomActions> -->
        </div>
      </div>
    </template>
  </BasePage>
</template>
