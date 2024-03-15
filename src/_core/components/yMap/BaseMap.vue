<script setup lang="ts">
import { ymapMarker, yandexMap } from "vue-yandex-maps";
import { MapMarkerModel } from "./MapMarkerModel";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    settings: any;
    markers?: MapMarkerModel<any>[];
    current?: [number, number];
    dragEnableOnMobile?: boolean;
    geolocationEnabled?: boolean;
    searchControlEnabled?: boolean;
    trafficControl?: boolean;
    fullscreenControlEnabled?: boolean;
    zoomControlEnabled?: boolean;
    rulerControl?: boolean;
    gray?: boolean;
  }>(),
  {
    geolocationEnabled: false,
    searchControlEnabled: false,
    trafficControl: false,
    fullscreenControlEnabled: false,
    zoomControlEnabled: false,
    rulerControl: false,
    dragEnableOnMobile: false,
    gray: false,
  },
);
const emits = defineEmits(["on-marker-click", "on-current-click", "on-init"]);

const ymap = ref(null);

const TABLET_SIZE = 760;

const mapWasInit = (map) => {
  onMapInit(map);
  emits("on-init", map);
};

const onMapInit = (map) => {
  if (!!props.gray) {
    //@ts-ignore
    document.getElementsByClassName("ymaps-2-1-79-ground-pane")[0].style["filter"] = "grayscale(100%)";
  }
  if (!props.dragEnableOnMobile && window.innerWidth < TABLET_SIZE) {
    map.behaviors.disable(["drag"]);
  }
  if (!props.geolocationEnabled) {
    map.controls.remove("geolocationControl"); // удаляем геолокацию
  }
  if (!props.searchControlEnabled) {
    map.controls.remove("searchControl"); // удаляем поиск
  }
  if (!props.geolocationEnabled) {
    map.controls.remove("trafficControl"); // удаляем контроль трафика
  }
  if (!props.trafficControl) {
    map.controls.remove("typeSelector"); // удаляем тип
  }
  if (!props.fullscreenControlEnabled) {
    map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
  }
  if (!props.zoomControlEnabled) {
    map.controls.remove("zoomControl"); // удаляем контрол зуммирования
  }
  if (!props.rulerControl) {
    map.controls.remove("rulerControl"); // удаляем контрол правил
  }
};
</script>

<template>
  <yandex-map ref="ymap" :settings="settings" class="ymap" @map-was-initialized="mapWasInit">
    <ymap-marker
      v-if="!!current"
      marker-id="current-position"
      :icon="{
        layout: 'default#image',
        imageHref: '/icons/map-current.svg',
        imageSize: [32, 32],
        imageOffset: [0, 0],
      }"
      :coords="current"
      @click="emits('on-current-click', current)"
    />

    <ymap-marker
      v-for="m in markers"
      :key="m.uuid"
      :marker-id="m.uuid"
      :icon="{
        layout: 'default#image',
        imageHref: m.iconHref,
        imageSize: m.imageSize,
        imageOffset: [0, 0],
      }"
      :coords="[m.latitude, m.longitude]"
      :hint-content="m.title"
      @click="emits('on-marker-click', m)"
    />
  </yandex-map>
</template>

<style lang="scss">
.ymaps-2-1-79-map-copyrights-promo {
  display: none !important;
}
.ymaps-2-1-79-copyrights-pane {
  display: none !important;
}
</style>
