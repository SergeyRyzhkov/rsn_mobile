<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ placeholder?: string; label?: string }>();

const text = computed(() => {
  return props.label || props.placeholder;
});
</script>

<template>
  <div class="base-readonly-input-wrapper relative cursor-pointer" :class="[!!label ? 'border-b !border-b-[#1f2023]' : '']">
    <div class="label" :class="[!!label ? '' : 'text-[#b0b0b0]']">{{ text }}</div>
    <img src="/icons/arrow_down.svg" class="absolute right-[2px] top-[15%]" />
  </div>
</template>

<style lang="scss">
.base-readonly-input-wrapper {
  width: 100%;
  outline: none;
  font-size: 15px;
  line-height: 20px;
  padding-bottom: 14px;
  // border-radius: 4px;
  border-bottom: 1px solid #c4ccd0;

  .label {
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    display: block;
    left: 17px;
    top: 18px;
    transition: 0.2s;
  }
}
</style>
