<script setup lang="ts">
import TheBottomMenu from "@/layouts/components/TheBottomMenu.vue";
import { StatusBar, Style } from "@capacitor/status-bar";
import { onMounted } from "vue";

onMounted(async () => {
  try {
    await StatusBar.setBackgroundColor({ color: "#3A49B9" });
  } catch {
    console.log("dddd");
  }
});
</script>

<template>
  <div class="layout-wrapper">
    <router-view v-slot="{ Component }">
      <transition name="slide-left" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TheBottomMenu></TheBottomMenu>
  </div>
</template>
