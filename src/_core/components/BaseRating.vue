<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

const props = withDefaults(defineProps<{ modelValue?: number; editable?: boolean; fontSize?: number; maxRaiting?: number }>(), {
  modelValue: 0,
  maxRaiting: 5,
  editable: false,
});

const emit = defineEmits(["update:modelValue"]);

const internalRating = ref(props.maxRaiting);

const goodRatingCount = computed(() => {
  return internalRating.value > props.maxRaiting ? props.maxRaiting : Math.round(internalRating.value);
});

const badRatingCount = computed(() => {
  return props.maxRaiting - goodRatingCount.value;
});

const imgSizePx = computed(() => {
  return !!props.fontSize ? `${props.fontSize}px` : props.editable ? "28px" : "18px";
});

const onStarClick = (good: boolean, index: number) => {
  if (props.editable) {
    internalRating.value = good ? index : props.maxRaiting - badRatingCount.value + index;
    emit("update:modelValue", internalRating.value);
  }
};

watchEffect(() => {
  internalRating.value = props.modelValue;
});
</script>

<template>
  <div class="base-rating-container">
    <img
      v-for="index1 in goodRatingCount"
      :key="`good-rating-${index1}`"
      src="/icons/good-star.svg"
      :class="{ 'mr-[8px] cursor-pointer': editable }"
      @click="onStarClick(true, index1)"
    />
    <img
      v-for="index2 in badRatingCount"
      :key="`bad-rating-${index2}`"
      src="/icons/empty-star.svg"
      :class="{ 'mr-[8px] cursor-pointer': editable }"
      @click="onStarClick(false, index2)"
    />
  </div>
</template>

<style lang="scss">
.base-rating-container {
  display: flex;
  align-items: center;

  img + img {
    margin-left: 1px;
  }

  img {
    height: v-bind(imgSizePx);
    width: v-bind(imgSizePx);
  }
}
</style>
