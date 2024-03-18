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
  <div class="relative flex items-center py-[8px] px-[10px]" @click="emit('on-focus')">
    <img src="/icons/search.svg" width="20" height="20" class="left-[12px] size-[20px]" alt=" " />
    <input
      class="w-full ml-[10px] mr-[16px] outline-none bg-transparent"
      :value="curValue"
      :placeholder="placeholder || 'Поиск...'"
      @input="onInput"
    />
    <span class="after:content-['\00d7'] text-24 text-[#848484]" @click="clear()"></span>
  </div>
</template>
