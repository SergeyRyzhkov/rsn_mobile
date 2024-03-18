<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import type { YMap } from "@yandex/ymaps3-types";
import {
  YandexMap,
  YandexMapDefaultSatelliteLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  createYmapsOptions,
  YandexMapMarker,
  YandexMapSphericalMercatorProjection,
  YandexMapTileDataSource,
  YandexMapLayer,
} from "vue-yandex-maps";

import type { YMapLayerProps, YMapTileDataSourceProps } from "@yandex/ymaps3-types";

import { MapMarkerModel } from "./MapMarkerModel";

const TABLET_SIZE = 760;

const map = shallowRef<null | YMap>(null);

const props = withDefaults(
  defineProps<{
    apiKey: string;
    settings: any;
    currentPosition?: [number, number];
    markers?: MapMarkerModel<any>[];
    dragEnableOnMobile?: boolean;
    gray?: boolean;
    mapType?: "standart" | "satellite" | "hybrid";
  }>(),
  {
    dragEnableOnMobile: false,
    gray: false,
    mapType: "standart",
  },
);
const emits = defineEmits(["on-marker-click", "on-current-click", "on-init"]);

const mapInitialized = ref(false);
onMounted(() => {
  createYmapsOptions({ apikey: props.apiKey });
  mapInitialized.value = true;
  onMapInit();
});

const mapFilterCss = computed(() => {
  return props.gray ? "grayscale(100%)" : "";
});

const onMapInit = () => {
  if (!props.dragEnableOnMobile && window.innerWidth < TABLET_SIZE) {
    map.value?.behaviors["drag"].disable;
  }
  emits("on-init", map.value);
  // map.value?.setMode.setType(props.mapType || "yandex#map");
};

const dataSourceProps: YMapTileDataSourceProps = {
  id: "custom",
  copyrights: ["© OpenStreetMap contributors"],
  raster: {
    type: "ground",
    // fetchTile: "https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png",
    // fetchTile: "https://tile1.maps.2gis.com/tiles?x={{x}}&y={{y}}&z={{z}}",
    fetchTile: "https://mt3.google.com/vt/lyrs=s&x={{x}}&y={{y}}&z={{z}}",
  },
  zoomRange: { min: 0, max: 19 },
  clampMapZoom: true,
};

const layerProps: YMapLayerProps = {
  id: "customLayer",
  source: "custom",
  type: "ground",
  options: {
    raster: {
      awaitAllTilesOnFirstDisplay: true,
    },
  },
};
</script>

<template>
  <section>
    <yandex-map v-if="!!mapInitialized" v-model="map" :settings="settings">
      <yandex-map-default-scheme-layer v-if="mapType === 'standart'" />
      <YandexMapDefaultSatelliteLayer v-if="mapType === 'satellite'" />
      <yandex-map-default-features-layer />

      <!-- <yandex-map-spherical-mercator-projection />
      <yandex-map-tile-data-source :settings="dataSourceProps" />
      <yandex-map-layer :settings="layerProps" />
    -->
      <template v-for="(marker, index) in markers" :key="index">
        <yandex-map-marker
          :settings="{ coordinates: marker.coords, hideOutsideViewport: true }"
          position="top-center left-center"
          @click="emits('on-marker-click', marker)"
        >
          <slot name="marker">
            <img class="size-[32px min-w-[32px]" src="/icons/map-current.svg" />
          </slot>
        </yandex-map-marker>
      </template>

      <template v-if="!!currentPosition">
        <yandex-map-marker
          :settings="{ coordinates: currentPosition, hideOutsideViewport: true }"
          position="top-center left-center"
          @click="emits('on-current-click', currentPosition)"
        >
          <slot name="currentPosition">
            <img class="size-[32px min-w-[32px]" src="/icons/map-current.svg" />
          </slot>
        </yandex-map-marker>
      </template>
    </yandex-map>
  </section>
</template>

<style lang="scss">
.ymaps3x0--map-copyrights {
  display: none !important;
}

.ymaps3x0--main-engine-container {
  filter: v-bind(mapFilterCss);
}
</style>
