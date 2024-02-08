<script setup lang="ts">
import { computed } from "vue";
import BaseLoader from "../BaseLoader.vue";
const props = withDefaults(
  defineProps<{
    paddingEmpty?: boolean;
    arrow?: boolean;
    outlined?: boolean;
    gray?: boolean;
    danger?: boolean;
    dangerOutlined?: boolean;
    green?: boolean;
    loading?: boolean;
    loaderSize?: number;
    disabled?: boolean;
    disabledGray?: boolean;
    smallText?: boolean;
  }>(),
  {
    paddingEmpty: false,
    arrow: false,
    outlined: false,
    gray: false,
    green: false,
    danger: false,
    dangerOutlined: false,
    loading: false,
    loaderSize: 26,
    disabled: false,
    disabledGray: false,
    smallText: false,
  },
);

const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
</script>

<template>
  <button
    class="relative flex cursor-pointer items-center justify-center rounded-[100px]"
    :class="[
      'transition-all',
      !props.outlined && !props.gray ? 'bg-primary  text-white hover:bg-secondary' : '',
      isDisabled
        ? '!hover:border-[#B7D5D8] !hover:bg-[#B7D5D8] !cursor-default border !border-primary !bg-[#FDF5FB] !text-primary !font-normal opacity-80'
        : '',
      isDisabled && outlined ? '!border-[#B7D5D8] !bg-white !text-[#B7D5D8]' : '',
      paddingEmpty ? 'p-0' : '',
      outlined ? 'hover:bg-secondary/[15] border border-primary bg-white text-primary ' : '',
      gray ? 'bg-[#F7F8FD] hover:bg-gray-300 text-secondary' : '',
      danger ? 'bg-[#FE5353] text-white hover:bg-red-500' : '',
      dangerOutlined ? 'border !border-[#FE5353] !bg-white !text-[#FE5353] hover:bg-red-50 ' : '',
      green ? 'bg-[#4CD081] !text-white hover:bg-green-400' : '',
      disabledGray ? '!border-gray-300 !bg-white !text-gray-500' : '',
    ]"
    v-bind="{
      ...$attrs,
      disabled: isDisabled,
    }"
  >
    <div class="mx-[14px] mb-[11px] mt-[9px] sm:mx-[20px] font-semibold" :class="[smallText ? 'text-12' : 'text-15 sm:text-16']">
      <slot></slot>
    </div>

    <BaseLoader v-if="loading" :size="loaderSize" />

    <div v-if="arrow" class="mr-[8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 2L8 6L4 10"
          :stroke="isDisabled ? '#B0B0B0' : '#4A9DF7'"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </button>
</template>
