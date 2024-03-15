<script setup lang="ts">
import CustomMap from "@/modules/maps/components/CustomMap.vue";
import BasePage from "@/layouts/components/BasePage.vue";
import TheHeader from "@/layouts/components/TheHeader.vue";
</script>

<template>
  <BasePage class="bg-page-bg">
    <template #header>
      <TheHeader />
    </template>
    <template #content>
      <CustomMap></CustomMap>
    </template>
  </BasePage>
</template>
