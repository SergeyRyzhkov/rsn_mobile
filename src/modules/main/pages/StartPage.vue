<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import StartPageHeader from "../components/StartPageHeader.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { useSpeechRecognition } from "@vueuse/core";
import { ref } from "vue";
import MainActionButton from "../components/MainActionButton.vue";

const result2 = ref("");
const result1 = ref("");

const { result, start } = useSpeechRecognition({
  lang: "en-US",
  interimResults: true,
  continuous: true,
});

const testVoice = async () => {
  await SpeechRecognition.requestPermissions();
  await SpeechRecognition.start({
    language: "ru-RU",
    maxResults: 5,
    partialResults: true,
    popup: false,
  });
  // listen to partial results
  SpeechRecognition.addListener("partialResults", (data: any) => {
    result.value = data.matches || data.data.value || data.data.matches;
  });
};

const testVoice2 = () => {
  //@ts-ignore
  alert(window.SpeechRecognition);
  //@ts-ignore
  alert(window.webkitSpeechRecognition);

  start();
};
</script>

<template>
  <BasePage class="bg-page-bg">
    <template #header>
      <StartPageHeader></StartPageHeader>
    </template>
    <template #content>
      <div class="flex flex-col grow container mb-[60px] mt-[20px]">
        <section class="flex flex-nowrap overflow-x-auto no-scrollbar mx-[-16px] px-[16px]">
          <MainActionButton
            title="Таймеры"
            img-src="/images/timers/timer_main.png"
            :route-props="{ name: 'timers-list' }"
          ></MainActionButton>

          <MainActionButton
            title="Погода"
            img-src="/images/weather/weather_main.png"
            bg-color="#b846c5"
            :route-props="{ name: 'timers-list' }"
            class="ml-[12px]"
          ></MainActionButton>

          <MainActionButton
            title="Погода"
            img-src="/images/weather/weather_main.png"
            bg-color="#00acef"
            :route-props="{ name: 'timers-list' }"
            class="ml-[12px]"
          ></MainActionButton>

          <MainActionButton
            title="Погода"
            img-src="/images/weather/weather_main.png"
            bg-color="#7256b6"
            :route-props="{ name: 'timers-list' }"
            class="ml-[12px]"
          ></MainActionButton>

          <MainActionButton
            title="Погода"
            img-src="/images/weather/weather_main.png"
            bg-color="#94a1fd"
            :route-props="{ name: 'timers-list' }"
            class="ml-[12px]"
          ></MainActionButton>
        </section>
        <section class="flex flex-col mt-[60px]">
          <img src="/images/main_page.png" alt=" " class="mt-auto overflow-hidden object-cover" />
          <BaseButton class="mt-[40px]" @click="testVoice">Test</BaseButton>
          <BaseButton class="mt-[30px]" @click="testVoice2">Test1</BaseButton>
        </section>

        <div class="mt-[30px]">
          {{ result }}
        </div>
        <div class="mt-[30px]"></div>
        {{ result1 }}
      </div>
    </template>
  </BasePage>
</template>
