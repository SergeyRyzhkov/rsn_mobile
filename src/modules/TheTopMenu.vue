<script setup lang="ts">
import { RouteLinkModel } from "@/_core/models/RouteLinkModel";

const menuItems: RouteLinkModel<any>[] = [];

const initMenuItemsList = () => {
  menuItems.push({
    linkName: "Дежурный доктор",
    icon: "/icons/fi-rr-time-past.svg",
    name: "select-booking-params",
  });
  menuItems.push({
    linkName: "Онлайн консультация",
    icon: "/icons/fi-rr-following.svg",
    name: "select-booking-params",
  });
  menuItems.push({
    linkName: "Вызов врача на дом",
    icon: "/icons/message-text.svg",
    name: "select-booking-params",
  });
};

const onMenuItemClicked = (item: RouteLinkModel<any>) => {
  if (!!item.addInfo) {
    // router.push({ name: item.name });
  }
};

initMenuItemsList();
</script>

<template>
  <ul :class="['no-scrollbar relative flex flex-nowrap items-center overflow-auto pb-[8px]']">
    <li
      v-for="(iter, index) in menuItems"
      :key="index"
      class="relative mr-[16px] flex h-[68px] w-[83px] min-w-[83px] cursor-pointer flex-col items-center justify-center rounded-[5px] border border-[#E4F4F4] bg-white"
      @click="onMenuItemClicked(iter)"
    >
      <img height="18" width="18" alt=" " class="size-[18px]" :src="iter.icon" />
      <span class="z-20 mt-[8px] text-center text-10 hover:text-primary">{{ iter.linkName }}</span>
    </li>
  </ul>
</template>
