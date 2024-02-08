<script lang="ts" setup>
import { ref } from "vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";
import { AppUpdate } from "@capawesome/capacitor-app-update";

const props = withDefaults(defineProps<{ isAppVersionOld?: boolean; isAppVersionMajor?: boolean }>(), {
  isAppVersionOld: false,
  isAppVersionMajor: false,
});

const isVisible = ref(true);

const updateApp = async () => {
  await AppUpdate.openAppStore({ country: "RU" });
};

const goToMainPage = () => {
  isVisible.value = false;
};
</script>

<template>
  <div
    v-if="isAppVersionOld && isVisible"
    class="check-version fixed inset-0 z-[99999999] flex h-[100vh] w-[100vw] flex-col items-center justify-end bg-white p-[30px]"
  >
    <div class="mt-[24px] text-center font-semibold">
      Исправили то, что нужно было исправить, <br />
      добавили то, что нужно было добавить ;)
    </div>
    <BaseButton class="mt-[32px] w-full" @click="updateApp">Обновить</BaseButton>
    <BaseButton v-if="!isAppVersionMajor" outlined class="mb-[43px] mt-[10px] w-full" @click="goToMainPage">Пропустить</BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.check-version {
  background: url("/images/check-version.png");
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: bottom;
  // position: absolute;
}
</style>
