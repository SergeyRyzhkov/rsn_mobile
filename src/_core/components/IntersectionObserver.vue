<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick, computed, useSlots } from "vue";

const infiniteScrollWrapper = ref();

const props = withDefaults(defineProps<{ root?; rootMargin?: string; threshold?: number }>(), {
  root: null,
  rootMargin: "50px",
  threshold: 0.0,
});

const slots = useSlots();

const emit = defineEmits(["intersect-enter", "intersect-leave"]);

const observable = computed(() => {
  return slots?.default?.()[0]?.el || infiniteScrollWrapper.value;
});

let observer = {
  observe(_target: Element) {},
  disconnect() {},
};

onMounted(() => {
  observer = new IntersectionObserver(([item], _observer) => {
    if (!!item) {
      item.isIntersecting ? emit("intersect-enter") : emit("intersect-leave");
    }
  }, props);
  observer.observe(observable.value);
});

onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<template>
  <div ref="infiniteScrollWrapper">
    <slot> </slot>
  </div>
</template>
