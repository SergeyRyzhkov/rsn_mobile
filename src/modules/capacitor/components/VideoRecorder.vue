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
      <button class="vide-modal-btn" @click.stop="close()">
        <img src="/icons/media_camera_front_back.svg" />
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

      <button class="vide-modal-btn" @click.stop="setFrontOrBackCamera()">
        <img src="/icons/media_camera_front_back.svg" />
      </button>

      <button class="vide-modal-btn" @click.stop="setFrontOrBackCamera()">
        <img src="/icons/media_camera_front_back.svg" />
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

.vide-modal-btn {
  @apply rounded-full min-w-[44px] min-h-[44px] size-[44px] bg-[#504d49] flex items-center justify-center p-[9px] text-white;
  > img {
    width: 100%;
  }
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
