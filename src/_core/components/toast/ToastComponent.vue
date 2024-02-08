<script setup lang="ts">
import { Guid } from "@/_core/utils/Guid";
import { nextTick, onMounted } from "vue";

const closeInterval = 3500;

const props = withDefaults(defineProps<{ id?: string; warning?: boolean; text?: string }>(), {
  id: Guid.newGuid(),
  warning: false,
});
const emit = defineEmits<{ (e: "close", id: string): void }>();

onMounted(() => {
  setTimeout(async () => {
    emit("close", props.id);
  }, closeInterval);
});
</script>

<template>
  <div
    :key="id"
    class="z-[2000001] w-[315px] max-w-[95vw] cursor-pointer rounded-lg p-[12px]"
    :class="[warning ? ' bg-[#FCD0CF] ' : ' bg-[#C5F2C7] ']"
    @click="emit('close', props.id)"
  >
    <div class="flex items-center">
      <div class="flex h-[40px] w-[40px] min-w-[40px] rounded-[6px]" :class="[warning ? 'bg-[#EFA6A4]' : 'bg-[#A3DDA6]']">
        <img :src="!warning ? '/images/victory-hand.png' : '/images/error.png'" width="22" height="22" class="m-auto h-[22px] w-[22px]" />
      </div>
      <div class="ml-[16px] w-full">
        <div class="flex justify-between align-top">
          <div class="text-16 font-semibold uppercase" :class="[warning ? 'text-[#FF5F5F]' : 'text-[#2CC13B]']">
            {{ warning ? "УПС!" : "Успешно!" }}
          </div>
          <button
            class="text-[30px] leading-[12px] after:content-['\00d7']"
            :class="[warning ? 'text-[#FF5F5F]' : 'text-[#2CC13B]']"
          ></button>
        </div>
        <div class="mt-[4px] whitespace-pre-wrap break-words text-12">{{ props.text }}</div>
      </div>
    </div>
  </div>
</template>
