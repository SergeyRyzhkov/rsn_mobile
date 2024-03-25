<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watchEffect } from "vue";
import type { YMap, LngLat } from "@yandex/ymaps3-types";
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
});

const mapFilterCss = computed(() => {
  return props.gray ? "grayscale(100%)" : "";
});

const onMapInit = () => {
  if (!props.dragEnableOnMobile && window.innerWidth < TABLET_SIZE) {
    map.value?.behaviors["drag"].disable;
  }

  const defaultBehaviors = [map.value?.behaviors["mouseRotate"], map.value?.behaviors["mouseTilt"]];
  map.value?.setBehaviors([...map.value.behaviors, ...defaultBehaviors]);

  emits("on-init", map.value);
};

watchEffect(() => {
  if (!!map.value) {
    onMapInit();
  }
});

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

async function fetchRoute(startCoordinates: LngLat, endCoordinates: LngLat) {
  // Request a route from the Router API with the specified parameters.
  const routes = await ymaps3.route({
    points: [startCoordinates, endCoordinates], // Start and end points of the route LngLat[]
    type: "driving", // Type of the route
    bounds: true, // Flag indicating whether to include route boundaries in the response
  });

  // Check if a route was found
  if (!routes[0]) return;

  // Convert the received route to a RouteFeature object.
  const firstRoute = routes[0].toRoute();

  // Check if a route has coordinates
  if (firstRoute.geometry.coordinates.length === 0) return;

  return firstRoute;
}
</script>

<template>
  <section>
    <yandex-map v-if="!!mapInitialized" v-model="map" :settings="settings" real-settings-location>
      <yandex-map-default-scheme-layer v-if="mapType === 'standart'" />
      <YandexMapDefaultSatelliteLayer v-if="mapType === 'satellite'" />
      <yandex-map-default-features-layer />

      <!-- <yandex-map-spherical-mercator-projection />
      <yandex-map-tile-data-source :settings="dataSourceProps" />
      <yandex-map-layer :settings="layerProps" />
    -->
      <template v-for="(marker, _index) in markers" :key="_index">
        <yandex-map-marker
          :settings="{ coordinates: marker.coords, hideOutsideViewport: true }"
          position="top-center left-center"
          @click="emits('on-marker-click', marker)"
        >
          <slot name="markers" :marker="marker">
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
