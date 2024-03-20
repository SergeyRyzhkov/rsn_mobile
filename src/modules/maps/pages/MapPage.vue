<script setup lang="ts">
import CustomMap from "@/modules/maps/components/CustomMap.vue";
import BasePage from "@/layouts/components/BasePage.vue";
import TheHeader from "@/layouts/components/TheHeader.vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "@/modules/alarms/services/AlarmEventService";
import { GeoPosition } from "@/modules/capacitor/useGeolocation";

const test = async (position: GeoPosition) => {
  // const event = await ServiceLocator.instance.getService(AlarmEventService).getEventById("test");
  // event.geoPosition = position;
  // ServiceLocator.instance.getService(AlarmEventService).updateEvent(event);
  alert(position.coords.latitude);
};
</script>

<template>
  <BasePage class="bg-page-bg">
    <template #header>
      <TheHeader />
    </template>
    <template #content>
      <CustomMap class="h-full" @on-position-changed="test"></CustomMap>
    </template>
  </BasePage>
</template>
