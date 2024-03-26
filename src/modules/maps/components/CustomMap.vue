<script setup lang="ts">
import BaseMap from "@/_core/components/yMap/BaseMap.vue";
import { computed, onUnmounted, ref, shallowRef, toRaw, unref, watchEffect } from "vue";
import { useGeolocation } from "@/modules/capacitor/useGeolocation";
import { MapMarkerModel } from "@/_core/components/yMap/MapMarkerModel";
import AddressSearchInput from "@/modules/alarms/components/AddressSearchInput.vue";
import type { YMap } from "@yandex/ymaps3-types";

const emits = defineEmits(["onPositionChanged"]);

const { checkPermissions, showOpenLocationSettingsDialog, currentPostion, startWatchPosition, stopWatchPosition, updateGeoPosition } =
  useGeolocation();

const mapSetting = ref({
  location: {
    center: [30.317702, 59.951645],
    zoom: 14,
  },
});

const changeCenterOnWatch = ref(false);

const currentYMPosition = computed<[number, number]>(() => {
  return !!currentPostion.value?.coords?.longitude && !!currentPostion.value?.coords?.latitude
    ? [currentPostion.value?.coords?.longitude, currentPostion.value?.coords?.latitude]
    : [0, 0];
});

watchEffect(() => {
  // if (currentPostion.value.valid && !!currentPostion.value.coords?.latitude && !!currentPostion.value.coords.longitude) {
  //   if (!!changeCenterOnWatch.value) {
  //     mapSetting.value.location.center = [currentPostion.value.coords.longitude, currentPostion.value.coords.latitude];
  //   }
  //   emits("onPositionChanged", unref(currentPostion));
  // }
});

const mapRef = shallowRef<null | YMap>(null);
const onMapInit = (map: YMap) => {
  mapRef.value = map;
};

const gotoToMyGeolocation = async (changeCenter = false) => {
  showOpenLocationSettingsDialog();
  if (!!(await checkPermissions(true))) {
    const position = await updateGeoPosition();
    if (!!position && !!position.coords.latitude && !!position.coords.longitude) {
      if (!!changeCenter) {
        mapRef.value?.setLocation({ center: [position.coords.longitude, position.coords.latitude], zoom: 17, duration: 1200 });
        // mapRef.value?.setCamera({ tilt: 50, azimuth: Math.PI });
      }
      emits("onPositionChanged", unref(currentPostion));
    }
  } else {
    showOpenLocationSettingsDialog();
  }
};

const startWatchGeolocation = async () => {
  if (!!(await checkPermissions(true))) {
    await gotoToMyGeolocation(changeCenterOnWatch.value);
    startWatchPosition();
  } else {
    showOpenLocationSettingsDialog();
  }
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
      @on-init="onMapInit"
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
