<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = withDefaults(defineProps<{ imgSrc: string; title?: string; bgColor?: string; routeProps?: any }>(), { bgColor: "#1290fc" });
const bgColorCss = computed(() => props.bgColor);

const emits = defineEmits(["click"]);
const onClick = (navigate) => {
  if (!!props.routeProps) {
    navigate();
  } else {
    emits("click");
  }
};
</script>

<template>
  <RouterLink v-slot="{ navigate }" :to="{ ...routeProps }" custom>
    <div class="flex flex-col w-fit" v-bind="$attrs">
      <div
        class="rounded-full border-[2px] border-[#21afec] size-[72px] flex justify-center items-center bg-white"
        @click="onClick(navigate)"
      >
        <div class="bar-action-button rounded-full flex justify-center items-center size-[64px]">
          <img :src="imgSrc" class="max-h-[44px] h-[44px]" />
        </div>
      </div>
      <span v-if="!!title" class="text-13 mt-[2px] mx-auto">{{ title }}</span>
    </div>
  </RouterLink>
</template>

<style lang="scss">
.bar-action-button {
  background-color: v-bind(bgColorCss);
}
</style>
