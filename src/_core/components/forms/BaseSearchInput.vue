<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

const props = defineProps<{ modelValue?: string; placeholder?: string }>();

const curValue = ref("");
const emit = defineEmits(["update:modelValue", "on-focus"]);

const onInput = (val) => {
  curValue.value = val.target.value;
  emit("update:modelValue", curValue.value);
};

const clear = () => {
  curValue.value = "";
  emit("update:modelValue", curValue.value);
};
watchEffect(() => {
  curValue.value = props.modelValue || "";
});
</script>

<template>
  <div class="relative flex items-center" @click="emit('on-focus')">
    <input
      class="w-full rounded-full bg-[#f0f0f0] py-[8px] pl-[40px] pr-[26px] outline-none"
      :value="curValue"
      :placeholder="placeholder || 'Поиск...'"
      @input="onInput"
    />
    <span class="after:content-['\00d7'] absolute right-[12px] text-24 text-[#848484]" @click="clear()"></span>
    <img src="/icons/search.svg" width="20" height="20" class="left-[12px] absolute top-1/2 size-[20px] -translate-y-1/2" alt=" " />
  </div>
</template>
