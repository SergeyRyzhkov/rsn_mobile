<script lang="ts" setup>
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { useRouter } from "vue-router";

const roter = useRouter();
const goHome = () => {
  roter.push({ name: "home-page" });
};
</script>
<template>
  <main class="page-wrapper container flex h-full items-center">
    <div class="mx-auto mt-[60px] w-full max-w-[336px] text-center">
      <img width="207" height="192" src="/images/no-results.svg" alt="Ничего не найдено" class="mx-auto w-[117px] sm:w-[207px]" />
      <div class="mt-[40px] text-[24px] font-bold leading-[34px]">Страница не найдена</div>
      <div class="test-[18px] mt-[8px] leading-[26px]">Запрашиваемая вами страница не найдена, перемещена, либо удалена</div>
      <a href="/">
        <BaseButton class="mt-[24px] w-full font-semibold" @click="goHome()">На главную</BaseButton>
      </a>
    </div>
  </main>
</template>
