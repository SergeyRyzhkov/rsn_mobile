<script setup lang="ts">
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import BasePage from "@/layouts/components/BasePage.vue";
import { MeteoService } from "../services/MeteoService";
import { ref } from "vue";
import { MeteoModel } from "../models/MeteoModel";
import TheHeader from "@/layouts/components/TheHeader.vue";
import BaseLoader from "@/_core/components/BaseLoader.vue";
import WeatherNow from "../components/WeatherNow.vue";

const loading = ref(false);
const meteoDataNow = ref<MeteoModel>();

const initMeteoData = async () => {
  loading.value = true;
  meteoDataNow.value = await ServiceLocator.instance.getService(MeteoService).getWeatherDataNow();
  loading.value = false;
};

initMeteoData();
</script>

<template>
  <BasePage class="bg-page-bg">
    <template #header>
      <TheHeader>
        <div class="flex items-center text-white font-medium text-16">Прогноз погоды</div>
      </TheHeader>
    </template>

    <template #content>
      <section v-if="!loading" class="container mt-[16px]">
        <div v-if="!!meteoDataNow" class="card-wrapper">
          <WeatherNow :model="meteoDataNow"></WeatherNow>
        </div>
      </section>
      <BaseLoader v-if="!!loading"></BaseLoader>
    </template>
  </BasePage>
</template>
