<script setup lang="ts">
import { computed } from "vue";
import { gotoBack } from "@/routerBuilder";
import { useRouter } from "vue-router";

const router = useRouter();

const onBack = () => {
  gotoBack(router);
};
</script>
<template>
  <header class="page-header">
    <div class="flex items-center container">
      <button class="flex items-center mr-[22px] text-white" @click="onBack()">
        <img src="/icons/back_white.svg" width="24" height="24" alt=" " class="h-[24px] w-auto" />
      </button>
      <slot></slot>
    </div>
  </header>
</template>
