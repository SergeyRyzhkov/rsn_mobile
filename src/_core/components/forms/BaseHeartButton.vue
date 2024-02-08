<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ checked?: boolean; size?: number; rounded?: boolean }>(), {
  checked: false,
  size: 16,
  rounded: true,
});

const src = computed(() => {
  return props.checked ? "/icons/heart-black.svg" : "/icons/heart.svg";
});
</script>

<template>
  <div>
    <div class="relative h-[22px] w-[22px] cursor-pointer">
      <button
        class="absolute inset-0 flex h-[22px] w-[22px] items-center justify-between opacity-50"
        :class="[rounded ? 'z-10 max-h-[22px] max-w-[22px] rounded-full bg-white ' : '']"
      ></button>
      <img :width="size" :height="size" alt=" " :src="src" class="absolute inset-0 z-50 m-auto h-[22px] w-[22px]" />
    </div>
  </div>
</template>
