<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import StartPageHeader from "../components/StartPageHeader.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { computed, nextTick, ref, toValue } from "vue";
import MainActionButton from "../components/MainActionButton.vue";
import { useSpeechRec } from "@/_core/composables/useSpeechRec";

const result2 = ref("");

const { start, stop, result } = useSpeechRec();

const startRecognition = () => {
  start();
};

const stopRecognition = async () => {
  stop();

  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance("Проверка воспроизведения текста");
  utterThis.lang = "ru-RU";
  utterThis.rate = 0.85;
  utterThis.volume = 1;
  //0 45 63
  utterThis.voice = synth.getVoices()[0];
  synth.speak(utterThis);

  console.log(synth.getVoices());
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
          <BaseButton class="mt-[30px]" @click="startRecognition">Записать</BaseButton>
          <BaseButton class="mt-[10px]" @click="stopRecognition">Остановить</BaseButton>
        </section>
        <div class="mt-[10px]">
          {{ result }}
        </div>
      </div>
    </template>
  </BasePage>
</template>
