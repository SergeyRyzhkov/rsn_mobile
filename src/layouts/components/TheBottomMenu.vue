<script setup lang="ts">
import { RouteLinkModel } from "@/_core/models/RouteLinkModel";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

const router = useRouter();
const route = useRoute();

const meniItems = ref<RouteLinkModel<null>[]>([]);

const initMenuItemsList = () => {
  meniItems.value = [];

  meniItems.value.push({
    linkName: "Главная",
    icon: "/icons/home.svg",
    name: "home-page",
    activeIcon: "/icons/home-active.svg",
  });

  meniItems.value.push({
    linkName: "Таймеры",
    icon: "/images/timers/stopwatch.png",
    activeIcon: "/images/timers/stopwatch.png",
    name: "timers-list",
  });

  meniItems.value.push({
    linkName: "Настройки",
    icon: "/icons/user-square.svg",
    activeIcon: "/icons/user-square-active.svg",
    name: "home-page",
  });
};

const isMenuItemActive = (item: RouteLinkModel<null>) => {
  return router.currentRoute.value.name === item.name;
};

initMenuItemsList();
</script>

<template>
  <nav class="mobile-bottom-menu border-t border-t-light-gray">
    <ul class="mx-[12px] flex flex-nowrap items-center justify-between overflow-x-scroll no-scrollbar">
      <li v-for="(iter, index) in meniItems" :key="index" class="relative mr-[4px] last:mr-0">
        <router-link :to="{ name: iter.name, params: iter.params }" class="flex w-full flex-col items-center">
          <img height="26" width="26" alt=" " class="size-[26px]" :src="isMenuItemActive(iter) ? iter.activeIcon : iter.icon" />
          <span class="mt-[4px] whitespace-nowrap text-center text-11" :class="[isMenuItemActive(iter) ? 'font-medium text-primary' : '']"
            >{{ iter.linkName }}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.mobile-bottom-menu {
  padding-top: 10px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  margin-top: auto;
  position: sticky;
  bottom: 0px;
  background-color: white;
  z-index: 999;
}
</style>
