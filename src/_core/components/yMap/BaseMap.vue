<script setup lang="ts">
import { ymapMarker, yandexMap } from "vue-yandex-maps";
import { MapMarkerModel } from "./MapMarkerModel";
import { ref } from "vue";

defineProps<{
  settings: any;
  markers?: MapMarkerModel<any>[];
  current?: [number, number];
}>();
const emits = defineEmits(["on-marker-click", "on-current-click", "on-init"]);

const ymap = ref(null);

const TABLET_SIZE = 760;

const mapWasInit = (map) => {
  //@ts-ignore
  document.getElementsByClassName("ymaps-2-1-79-ground-pane")[0].style["filter"] = "grayscale(100%)";
  if (window.innerWidth < TABLET_SIZE) {
    map.behaviors.disable(["drag"]);
  }
  emits("on-init", map);
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
