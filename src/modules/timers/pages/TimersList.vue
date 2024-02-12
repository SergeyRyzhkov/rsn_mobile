<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import TheHeader from "@/layouts/components/TheHeader.vue";
</script>

<template>
  <BasePage>
    <template #header>
      <TheHeader />
    </template>
    <template #content>
      <section>Таймеры</section>
    </template>
  </BasePage>
</template>
