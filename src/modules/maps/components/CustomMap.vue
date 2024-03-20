<script setup lang="ts">
import BaseMap from "@/_core/components/yMap/BaseMap.vue";
import { computed, onUnmounted, ref, toRaw, unref, watchEffect } from "vue";
import { useGeolocation } from "@/modules/capacitor/useGeolocation";
import { MapMarkerModel } from "@/_core/components/yMap/MapMarkerModel";
import AddressSearchInput from "@/modules/alarms/components/AddressSearchInput.vue";

const emits = defineEmits(["onPositionChanged"]);

const { currentPostion, startWatchPosition, stopWatchPosition, updateGeoPosition } = useGeolocation();

const mapSetting = ref({
  location: {
    center: [30.317702, 59.951645],
    zoom: 14,
  },
});

const changeCenterOnWatch = ref(false);

const currentYMPosition = computed<[number, number]>(() => {
  return !!currentPostion.value?.coords?.longitude && currentPostion.value?.coords?.latitude
    ? [currentPostion.value?.coords?.longitude, currentPostion.value?.coords?.latitude]
    : [0, 0];
});

watchEffect(() => {
  if (currentPostion.value.valid && !!currentPostion.value.coords?.latitude && !!currentPostion.value.coords.longitude) {
    if (!!!!changeCenterOnWatch.value) {
      mapSetting.value.location.center = [currentPostion.value.coords.longitude, currentPostion.value.coords.latitude];
    }
    emits("onPositionChanged", unref(currentPostion));
  }
});

const gotoToMyGeolocation = async (changeCenter = false) => {
  const position = await updateGeoPosition();
  if (!!position && !!position.coords.latitude && !!position.coords.longitude) {
    if (!!changeCenter) {
      mapSetting.value.location.center = [position.coords.longitude, position.coords.latitude];
    }
    emits("onPositionChanged", unref(currentPostion));
  }
};

const startWatchGeolocation = async () => {
  await gotoToMyGeolocation(changeCenterOnWatch.value);
  startWatchPosition();
};

onUnmounted(() => {
  stopWatchPosition();
});
</script>

<template>
  <section class="size-full relative">
    <BaseMap
      drag-enable-on-mobile
      api-key="26d989de-9503-4650-bc42-2bfad0128a78"
      class="!absolute size-full"
      :settings="mapSetting"
      :current-position="currentYMPosition"
    ></BaseMap>

    <AddressSearchInput class="absolute top-[4px] inset-x-[4px] z-[9999999999]"></AddressSearchInput>

    <div class="absolute right-[6px] top-[40%] flex flex-col z-[9999999999]">
      <button class="map_zoom_button" @click="gotoToMyGeolocation(false)">MF</button>
      <button class="map_zoom_button mt-[8px]" @click="startWatchGeolocation">W</button>
      <button class="map_zoom_button mt-[50px]" @click="gotoToMyGeolocation(true)">
        <img src="/icons/map_navigate.svg" class="size-[18px]" />
      </button>
    </div>
  </section>
</template>

<style lang="scss">
.map_zoom_button {
  width: 46px;
  min-width: 46px;
  height: 46px;
  min-height: 46px;
  background-color: white;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 30px 0px #1932821a;
  border: 1px solid #e8eaf6;
  background-color: white;
}
</style>
