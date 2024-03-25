<script setup lang="ts">
import { DefineComponent, computed, defineAsyncComponent, ref } from "vue";
import { useMediaRecorder } from "@/modules/capacitor/useMediaRecorder";
import BaseButton from "@/_core/components/forms/BaseButton.vue";

const playerSrc = ref<{ src?: string; type?: string }>({});

const recorder = useMediaRecorder();

const startRecording = async () => {
  recorder.startRecording();
};

const stopRecording = async () => {
  const data = await recorder.stopRecording();
  playerSrc.value.src = data?.base64String;
};
</script>

<template>
  <section>
    <!-- <video ref="video" controls autoplay playsinline></video> -->
    <BaseButton @click="startRecording">startRecording</BaseButton>
    <BaseButton @click="stopRecording">stopRecording</BaseButton>
    <section class="relative">
      <video class="mt-[20px]" :src="playerSrc?.src" controls></video>
    </section>
  </section>
</template>
