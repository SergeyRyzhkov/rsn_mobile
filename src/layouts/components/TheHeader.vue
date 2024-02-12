<script setup lang="ts">
import { computed } from "vue";
import { gotoBack, router } from "@/routerBuilder";

const onBack = () => {
  gotoBack();
};
</script>
<template>
  <header class="z-[99999] page-header">
    <div class="flex items-center justify-between container">
      <button class="flex items-center" @click="onBack()">
        <img src="/icons/back_white.svg" width="20" height="20" alt=" " class="h-[20px] w-auto" />
      </button>
    </div>
  </header>
</template>
