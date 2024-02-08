<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import TheBottomMenu from "@/layouts/components/TheBottomMenu.vue";
import TheHeader from "@/layouts/components/TheHeader.vue";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import UpdateAppVersion from "@/modules/main/components/UpdateAppVersion.vue";
import { Device } from "@capacitor/device";
import useModal from "./_core/components/modal/useModal";
import BaseMessageModal from "@/modules/main/components/BaseMessageModal.vue";
import { AppService } from "./modules/main/services/AppService";

const modal = useModal();

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

const isAppVersionOld = ref(false);
const isAppVersionMajor = ref(false);

const marginTop = computed(() => {
  return isIOS ? "16px" : "22px";
});

const isProduction = import.meta.env.VITE_APP_API_URL.includes("api.vrachi-online");

const headerVisible = computed(() => {
  return true;
});

const checkVersion = async () => {
  try {
    const info = await Device.getInfo();
    const data = await ServiceLocator.instance
      .getService(AppService)
      .getCurrentVersionOfApp(info.platform, process.env.npm_package_version || "100.10.10");

    isAppVersionOld.value = data.is_old;
    isAppVersionMajor.value = data.is_major;
  } catch {
    console.log("err");
  }
};

checkVersion();

onMounted(() => {
  if (!isProduction) {
    modal.show(BaseMessageModal, { text: "Вы используете тестовую версию приложения !" });
  }
});
</script>

<template>
  <div class="layout-wrapper">
    <div class="h-[16px] bg-white fixed top-0 w-full z-50"></div>
    <TheHeader v-if="headerVisible" class="main-header container"></TheHeader>
    <router-view v-slot="{ Component }">
      <transition name="slide-left" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TheBottomMenu></TheBottomMenu>
    <UpdateAppVersion :is-app-version-old="isAppVersionOld" :is-app-version-major="isAppVersionMajor" />
  </div>
</template>

<style lang="scss">
.main-header {
  margin-top: 16px;
  padding-bottom: 16px;
  position: sticky;
  top: 16px;
  z-index: 99999;
  background: white;
  /* iOS 11.0 */
  padding-top: constant(safe-area-inset-top);
  /* Высота статус-бара в iOS 11+ */
  padding-top: env(safe-area-inset-top);
  // padding-top: 20px;
}
</style>
