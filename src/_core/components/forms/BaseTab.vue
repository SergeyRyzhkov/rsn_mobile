<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{ tabs: { caption: string }[]; activeTab?: number }>(), { activeTab: 0 });
const emit = defineEmits(["on-change"]);

const currentIndex = ref(props.activeTab);

const activeIndex = computed(() => {
  return currentIndex;
});

const changeTab = (index: number) => {
  currentIndex.value = index;
  emit("on-change", index);
};

defineExpose({ changeTab });
</script>

<template>
  <div class="bg-secondary py-[8px]">
    <div class="container flex flex-nowrap overflow-x-auto">
      <button
        v-for="(iter, index) in tabs"
        :key="index"
        class="mr-[2px] rounded-[6px] py-[6px] transition-all"
        :class="[
          activeIndex.value === index && tabs.length > 1 ? 'bg-white text-secondary' : 'bg-secondary text-white',
          tabs.length > 1 ? 'w-1/2 px-[4px]' : '',
        ]"
        @click="changeTab(index)"
      >
        {{ iter.caption }}
      </button>
    </div>
  </div>
</template>
