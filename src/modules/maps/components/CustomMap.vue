<script setup lang="ts">
import BaseMap from "@/_core/components/yMap/BaseMap.vue";
import { onUnmounted, ref, watchEffect } from "vue";
import { useGeolocation } from "@/modules/capacitor/useGeolocation";

const { currentPostion, startWatchPosition, stopWatchPosition } = useGeolocation();

const mapSettings = {
  apiKey: "26d989de-9503-4650-bc42-2bfad0128a78",
  lang: "ru_RU",
  coordorder: "latlong",
  enterprise: false,
  version: "2.1",
};

const mapCenter = ref<[number, number]>([59.951645, 30.317702]);

startWatchPosition();

watchEffect(() => {
  if (!!currentPostion.value.coords?.latitude && !!currentPostion.value.coords.longitude) {
    mapCenter.value = [currentPostion.value.coords.latitude, currentPostion.value.coords.longitude];
  }
});

onUnmounted(() => {
  stopWatchPosition();
});
</script>

<template>
  <div class="flex flex-col grow size-full relative">
    <BaseMap
      gray
      drag-enable-on-mobile
      :settings="mapSettings"
      :coords="mapCenter"
      :current="mapCenter"
      zoom="14"
      class="absolute inset-0 size-full"
    ></BaseMap>
  </div>
</template>

<style lang="scss">
.ymaps-2-1-79-map-copyrights-promo {
  display: none !important;
}
.ymaps-2-1-79-copyrights-pane {
  display: none !important;
}
</style>
