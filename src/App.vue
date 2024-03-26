<script setup lang="ts">
import TheBottomMenu from "@/layouts/components/TheBottomMenu.vue";
</script>

<template>
  <div class="layout-wrapper">
    <router-view v-slot="{ Component }">
      <!-- <transition name="fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </transition> -->
    </router-view>
    <TheBottomMenu></TheBottomMenu>
  </div>
</template>
