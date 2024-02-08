<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import ToastComponent from "./ToastComponent.vue";

const toastItemList = ref<{ warning: boolean; text: string; id: string }[]>([]);

const addNotify = (notify: { warning: boolean; text: string; id: string }) => {
  toastItemList.value.push(notify);
};

const closeNotify = async (id: string) => {
  const index = toastItemList.value.findIndex((iter) => iter.id === id);
  if (index > -1) {
    toastItemList.value.splice(index, 1);
  }
};

defineExpose({ addNotify, closeNotify });
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Teleport to="body">
    <div
      id="toast-container"
      class="fixed inset-x-[20px] top-[55px] z-[999999999999999999] flex max-h-[90vh] flex-col overflow-auto"
    >
      <ToastComponent
        v-for="iter in toastItemList"
        v-bind="iter"
        :key="iter.id"
        class="my-[6px] mx-auto"
        @close="(id:string)=>{closeNotify(id)}"
      ></ToastComponent>
    </div>
  </Teleport>
</template>
