<script setup lang="ts">
import BaseHeartButton from "./forms/BaseHeartButton.vue";

const emits = defineEmits(["toggle-favorite"]);
const props = withDefaults(defineProps<{ isChecked?: boolean; showText?: boolean }>(), { showText: true });
</script>

<template>
  <div class="flex w-max cursor-pointer items-center" @click.prevent.stop="emits('toggle-favorite', !props.isChecked)">
    <BaseHeartButton :checked="props.isChecked" :rounded="false" />
    <template v-if="showText">
      <span v-if="props.isChecked" class="text-12">Убрать из избранного</span>
      <span v-else class="text-12">Добавить в избранное</span>
    </template>
  </div>
</template>
