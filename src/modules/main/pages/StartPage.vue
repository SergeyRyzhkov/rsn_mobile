<script setup lang="ts">
import BasePage from "@/layouts/components/BasePage.vue";
import TheHeader from "@/layouts/components/TheHeader.vue";
import StartPageHeader from "../components/StartPageHeader.vue";
</script>

<template>
  <BasePage class="bg-[#f5f9fc]">
    <template #header>
      <StartPageHeader></StartPageHeader>
    </template>
    <template #content>
      <section class="flex flex-col grow">
        <img src="/images/20140726_201133.png" alt=" " class="m-auto overflow-hidden object-cover" />
      </section>
    </template>
  </BasePage>
</template>
