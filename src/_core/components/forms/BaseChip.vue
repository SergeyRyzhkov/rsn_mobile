<script setup lang="ts">
const props = defineProps<{ text: string; selected?: boolean; closable?: boolean }>();

const emits = defineEmits<{
  onSelect: [text: string];
}>();
</script>

<template>
  <div class="base-chip" :class="{ 'base-chip__disabled': !selected }" @click="emits('onSelect', text)">
    <span>{{ text }}</span>
    <span
      v-if="closable"
      class="mr-[-6px] !ml-auto flex cursor-pointer items-center justify-center pl-[10px] text-[22px] leading-14 text-gray-500 transition-all after:content-['\00d7'] hover:text-gray-800"
    ></span>
  </div>
</template>

<style lang="scss">
.base-chip {
  display: flex;
  height: 26px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border-radius: 39px;
  background: #2f334e;
  font-size: 12px;
  color: white;
  white-space: nowrap;
  margin-right: 8px;
  cursor: pointer;
}

.base-chip__disabled {
  background-color: #f0f6f9;
  color: $text-color;
}
</style>
