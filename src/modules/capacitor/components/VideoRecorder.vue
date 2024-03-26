<script setup lang="ts">
import { useMediaRecorder } from "@/modules/capacitor/useMediaRecorder";
import { computed, onUnmounted, ref, watchEffect, watchPostEffect } from "vue";

const videoRef = ref<HTMLVideoElement>();
const recording = ref(false);
const showInternal = ref(false);
const wrapperStyle = ref("video-modal-content");

let recorderBlob: Blob[] = [];
let isFrontCamera = false;

const props = defineProps<{ show: boolean }>();

const emits = defineEmits<{
  onClose: [blob: Blob];
}>();

watchPostEffect(() => {
  showInternal.value = props.show;
});

const onChunk = (blob: Blob) => {
  if (!!recording.value) {
    recorderBlob.push(blob);
  }
};

const { startRecording, stopRecording, humanTotalSize } = useMediaRecorder();

const humanTotalSizeComp = computed(() => {
  return !!recording.value ? humanTotalSize.value : 0;
});

const setFrontOrBackCamera = async () => {
  const isReccording = recording.value;
  await stopRecord();
  if (!!isReccording) {
    await startRecord();
  } else {
    await initEmptyVideoRecorder();
  }
  isFrontCamera = !isFrontCamera;
};

const toogleRecord = () => {
  if (!recording.value) {
    startRecord();
  } else {
    stopRecord();
  }
};

const startRecord = async () => {
  recording.value = true;
  recorderBlob.length = 0;
  recorderBlob = [];
  clearResource();

  const stream = await startRecording({ onChunkCallback: onChunk, isFrontCamera });
  if (!!stream && !!videoRef.value) {
    videoRef.value.srcObject = stream;
  }
};

const stopRecord = async () => {
  recording.value = false;
  clearResource();
  await stopRecording();
  await initEmptyVideoRecorder();
};

const playSaved = async () => {
  if (!recording.value && !!recorderBlob && !!recorderBlob.length && !!videoRef.value) {
    await stopRecording();
    clearResource();
    const blob = new Blob(recorderBlob);
    if (!!blob) {
      videoRef.value.controls = true;
      videoRef.value.src = URL.createObjectURL(blob);
    }
  }
};

const initEmptyVideoRecorder = async () => {
  clearResource();
  const stream = await startRecording({ isFrontCamera });
  if (!!stream && !!videoRef.value) {
    videoRef.value.srcObject = stream;
  }
};

const clearResource = () => {
  if (!!videoRef.value) {
    videoRef.value.controls = false;
    URL.revokeObjectURL(videoRef.value.src);
    videoRef.value.srcObject = null;
  }
};

const close = async () => {
  await stopRecording();
  clearResource();
  wrapperStyle.value = "video-modal-content__close";
  const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
  await sleep(200);
  if (!!recorderBlob && !!recorderBlob.length) {
    emits("onClose", new Blob(recorderBlob));
  }
  showInternal.value = false;
};

onUnmounted(() => {
  clearResource();
});

initEmptyVideoRecorder();
</script>

<template>
  <section v-if="showInternal" class="fixed inset-0 size-full bg-[#504d49] z-[9999999999999999]" :class="wrapperStyle">
    <div v-show="!!humanTotalSizeComp" class="absolute top-[40px]">
      {{ humanTotalSizeComp }}
    </div>
    <video ref="videoRef" class="!w-full !min-h-full !h-full inset-0 object-cover" :controls="false" autoplay></video>

    <div class="absolute inset-x-[35px] bottom-[50px] flex items-center justify-between">
      <button class="rounded-full min-w-[35px] min-h-[35px] size-[35px]" @click.stop="close()">
        <img
          src="data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%23727A87' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_5_'%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M394.2,142L370,117.8c-1.6-1.6-4.1-1.6-5.7,0L258.8,223.4c-1.6,1.6-4.1,1.6-5.7,0L147.6,117.8 c-1.6-1.6-4.1-1.6-5.7,0L117.8,142c-1.6,1.6-1.6,4.1,0,5.7l105.5,105.5c1.6,1.6,1.6,4.1,0,5.7L117.8,364.4c-1.6,1.6-1.6,4.1,0,5.7 l24.1,24.1c1.6,1.6,4.1,1.6,5.7,0l105.5-105.5c1.6-1.6,4.1-1.6,5.7,0l105.5,105.5c1.6,1.6,4.1,1.6,5.7,0l24.1-24.1 c1.6-1.6,1.6-4.1,0-5.7L288.6,258.8c-1.6-1.6-1.6-4.1,0-5.7l105.5-105.5C395.7,146.1,395.7,143.5,394.2,142z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        />
      </button>

      <button
        class="p-[6px] rounded-full min-w-[80px] min-h-[80px] size-[80px] border-white border bg-transparent transition-all"
        @click.stop="toogleRecord()"
      >
        <div v-show="!recording" class="rounded-full bg-white size-full flex items-center justify-center">
          <div class="rounded-full bg-red-800 size-[18px]"></div>
        </div>
        <div v-show="!!recording" class="bg-white size-[28px] m-auto"></div>
      </button>

      <button class="rounded-full min-w-[35px] min-h-[35px] size-[35px] bg-[#504d49]" @click.stop="setFrontOrBackCamera()">
        <img
          src="data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%232CD865' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_1_'%3E%3Cg%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M208,301.4l-55.4-55.5c-1.5-1.5-4-1.6-5.6-0.1l-23.4,22.3c-1.6,1.6-1.7,4.1-0.1,5.7l81.6,81.4 c3.1,3.1,8.2,3.1,11.3,0l171.8-171.7c1.6-1.6,1.6-4.2-0.1-5.7l-23.4-22.3c-1.6-1.5-4.1-1.5-5.6,0.1L213.7,301.4 C212.1,303,209.6,303,208,301.4z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        />
      </button>
    </div>
  </section>
</template>

<style lang="scss">
.video-modal-content {
  animation: video-modal_scale_animation 0.25s linear 0s;
}

.video-modal-content__close {
  animation: video-modal_scale_animation__close 0.25s linear 0s;
}

@keyframes video-modal_scale_animation {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(0.4);
  }
  60% {
    transform: scale(0.6);
  }
  90% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes video-modal_scale_animation__close {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(0.6);
  }
  90% {
    transform: scale(0.4);
  }
  100% {
    transform: scale(0);
  }
}
</style>
