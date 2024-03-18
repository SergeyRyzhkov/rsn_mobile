<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import TheTopMenu from "@/layouts/components/TheTopMenu.vue";
import TheBottomActions from "@/layouts/components/TheBottomActions.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { FirebaseStorage } from "@/modules/firebase/FirebaseStorage";
import { useCamera } from "@/modules/capacitor/useCamera";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "@/modules/alarms/services/AlarmEventService";

const camera = useCamera();
// const geolocation = useGeolocation();

const fireBaseStorage = new FirebaseStorage();

const testPilki = (url: string) => {
  ServiceLocator.instance.getService(AlarmEventService).createEvent();
};

const listFiles = async () => {
  // console.log(await fireBaseStorage.listFiles({ path: "images" }));
  // console.log(await fireBaseStorage.getFolderSize("images"));
  console.log(await fireBaseStorage.getBasketSize());
};

const openCamera = async () => {
  const blob = await camera.getPhoto();
  if (!!blob) {
    fireBaseStorage.uploadFile("images/test1.jpeg", blob);
  }
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
          <!-- <TheTopMenu></TheTopMenu> -->
        </div>
        <section class="flex flex-col my-auto relative max-h-[50vh] h-[50vh]">
          <img src="/images/main_page.png" alt=" " class="object-contain z-40 h-full" />
        </section>

        <div class="container">
          <BaseButton class="mt-[32px]" @click="listFiles">listFiles</BaseButton>
          <BaseButton class="mt-[32px]" @click="openCamera">openCamera</BaseButton>
          <BaseButton class="mt-[32px]" @click="testPilki">event</BaseButton>

          <!-- <TheBottomActions></TheBottomActions> -->
        </div>
      </div>
    </template>
  </BasePage>
</template>
@/modules/capacitor/useCamera
