<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits(["files-dropped"]);
const active = ref(false);

const setActive = () => {
  active.value = true;
};

const setInactive = () => {
  active.value = false;
};

const onDrop = (e) => {
  setInactive();
  emit("files-dropped", [...e.dataTransfer.files]);
};

const preventDefaults = (e) => {
  e.preventDefault();
};

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});
</script>

<template>
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <slot :drop-zone-active="active"></slot>
  </div>
</template>
