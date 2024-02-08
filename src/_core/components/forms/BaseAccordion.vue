<script setup lang="ts">
import { onMounted, ref } from "vue";
import autoAnimate from "@formkit/auto-animate";

const accordionRef = ref();

const props = withDefaults(defineProps<{ expanded?: boolean }>(), { expanded: false });
const isContentActive = ref(props.expanded);

const toggle = () => {
  isContentActive.value = !isContentActive.value;
};

onMounted(() => {
  autoAnimate(accordionRef.value);
});
</script>

<template>
  <div ref="accordionRef" class="base-accordion">
    <div class="flex cursor-pointer items-center justify-between px-[10px] py-[13px] md:p-[20px]" @click="toggle()">
      <slot name="header"></slot>
      <div class="base-accordion__togler p-1">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            :class="{ 'base-accordion--open': isContentActive }"
            d="M7.9987 2.5V14.5"
            stroke="white"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="round"
          />
          <path d="M2 8.49967H14" stroke="white" stroke-width="2" stroke-linecap="square" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div v-if="isContentActive" class="base-accordion__content">
      <div class="md:mt-[-5px] px-[10px] pb-[13px] md:px-[20px] md:pb-[20px]">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.base-accordion {
  background-color: #f7f8fc;
  border-radius: 10px;

  color: #4f5259;

  &__togler {
    background: linear-gradient(180deg, #a25cfe 0%, #424ebb 71.43%);
    border-radius: 5px;
  }

  &__content {
    transition: 0.1s;
    overflow: hidden;
  }
  &--open {
    transition: all 0.1s;
    transform: rotate(180deg);
  }
}
</style>
