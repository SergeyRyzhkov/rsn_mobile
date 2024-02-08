<script setup lang="ts">
import { ref, computed, watchEffect, onUnmounted, defineAsyncComponent, DefineComponent } from "vue";
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.classic.scss";
import BaseLoader from "./BaseLoader.vue";
import DropZone from "./DropZone.vue";
import Reducer from "image-blob-reduce";

const props = withDefaults(
  defineProps<{
    imageSrc?: string;
    wrapperClasses?: string;
    dropzoneClasses?: string;
    maxSize?: number;
    format?: string[];
    dragStartClasses?: string;
    dragLeaveClasses?: string;
    circle?: boolean;
  }>(),
  {
    wrapperClasses: "",
    dragStartClasses: "border-[#bcbcbc]",
    dragLeaveClasses: "border-[#4A9DF7]",
    dropzoneClasses: "min-h-[150px] min-w-[100px]",
    maxSize: 5,
    format() {
      return ["png", "jpg", "jpeg"];
    },
    circle: false,
  },
);

enum ImageUploadState {
  EMPTY,
  FILL,
  MAX_SIZE_ERROR,
  INVALID_FORMAT_ERROR,
  ERROR,
}

const fileInputRef = ref();
const cropperRef = ref();
const loadedImageSrc = ref<string | null>();
const file = ref<File | null>();
const state = ref<ImageUploadState>(ImageUploadState.EMPTY);

const isCropperReady = ref(false);
const loading = ref(false);

const emit = defineEmits(["change"]);

const reducer = Reducer();

watchEffect(() => {
  if (!loadedImageSrc.value) {
    if (!!props.imageSrc && (state.value === ImageUploadState.FILL || state.value === ImageUploadState.EMPTY)) {
      loadedImageSrc.value = props.imageSrc;
    }
  }
  state.value = loadedImageSrc.value ? ImageUploadState.FILL : state.value;
});

onUnmounted(() => {
  if (!!loadedImageSrc.value) {
    URL.revokeObjectURL(loadedImageSrc.value);
  }
});

const acceptFiles = computed(() => {
  return `${props.format.map((ext) => `image/${ext}`).join(",")}`;
});

const uploadText = computed(() => {
  if (state.value === ImageUploadState.EMPTY) {
    return "Перетащите файл или нажмите для загрузки изображения";
  }
  if (state.value === ImageUploadState.MAX_SIZE_ERROR) {
    return `Загрузите изображение размером не более ${props.maxSize} Mb`;
  }
  if (state.value === ImageUploadState.INVALID_FORMAT_ERROR) {
    return `Недопустимый формат изображения`;
  }
  return "Перетащите файл или нажмите для загрузки изображения";
});

const stencilComponent = computed(() => {
  return props.circle ? CircleStencil : RectangleStencil;
});

const filesDropped = (files: File[]) => {
  loadImage(!!files && !!files.length ? files[0] : null);
};

const fileInputChange = (event) => {
  loadImage(!!event.target && !!event.target.files.length ? event.target.files[0] : null);
};

const loadImage = async (loadFile: File | null) => {
  loading.value = true;
  state.value = ImageUploadState.EMPTY;
  if (!!loadedImageSrc.value) {
    URL.revokeObjectURL(loadedImageSrc.value);
    loadedImageSrc.value = null;
  }

  if (!!loadFile) {
    file.value = loadFile;
    if (!props.format?.includes(loadFile.type.split("/")[1])) {
      state.value = ImageUploadState.INVALID_FORMAT_ERROR;
    }

    if (state.value !== ImageUploadState.INVALID_FORMAT_ERROR && loadFile.size > props.maxSize * 1024 * 1024) {
      state.value = ImageUploadState.MAX_SIZE_ERROR;
    }

    if (state.value !== ImageUploadState.MAX_SIZE_ERROR && state.value !== ImageUploadState.INVALID_FORMAT_ERROR) {
      //
      try {
        const reducedBlob = await reducer.toBlob(loadFile, {
          max: 4096,
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
        });

        loadedImageSrc.value = URL.createObjectURL(reducedBlob);
        state.value = ImageUploadState.FILL;
        isCropperReady.value = false;
      } catch {
        state.value = ImageUploadState.INVALID_FORMAT_ERROR;
      }
      //
    }
  }
  loading.value = false;
};

const onCropChange = (payload: any) => {
  if (!!payload.canvas) {
    emit("change", payload.canvas.toDataURL());
  }
};

const flip = (x, y) => {
  if (cropperRef.value.imageTransforms.rotate % 180 !== 0) {
    cropperRef.value.flip(!x, !y);
  } else {
    cropperRef.value.flip(x, y);
  }
};

const rotate = (angle) => {
  cropperRef.value.rotate(angle);
};

const download = () => {
  const result = cropperRef.value.getResult().canvas.toDataURL();
  const newTab = window.open();
  if (!!newTab) {
    newTab.document.body.innerHTML = `<img src="${result}"></img>`;
  }
};

const getDataURL = () => {
  return cropperRef.value ? cropperRef.value.getResult().canvas?.toDataURL() : null;
};

const getCanvas = () => {
  return cropperRef.value ? cropperRef.value.getResult().canvas : null;
};

const getFile = () => {
  return file.value;
};

defineExpose({ cropperRef, getDataURL, getCanvas, getFile });
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <div class="flex !max-h-[95vh] !max-w-[95vw]" :class="wrapperClasses">
    <div v-if="loadedImageSrc" class="cropper-wrapper">
      <BaseLoader v-if="!isCropperReady" :size="90" class="!bg-black" />
      <cropper
        ref="cropperRef"
        :src="loadedImageSrc"
        v-bind="$attrs"
        :canvas="{
          maxHeight: 4096,
          maxWidth: 4096,
        }"
        class="h-[400px] !max-h-[95vh] w-[800px] !max-w-[90vw] md:h-[600px]"
        :stencil-component="stencilComponent"
        @change="onCropChange"
        @ready="isCropperReady = true"
        @error="
          {
            isCropperReady = true;
            state = ImageUploadState.ERROR;
          }
        "
      />

      <div v-if="state === ImageUploadState.ERROR" class="absolute inset-0 m-auto flex h-full w-full flex-col items-center justify-center">
        <img src="/icons/img-error.svg" alt=" " height="26" width="26" />
        <div class="mt-[8px] max-w-[220px] text-center text-[14px] text-[#EB5757]">
          Ошибка.<br />
          Попробуйте еще раз
        </div>
      </div>

      <div v-if="isCropperReady" class="absolute left-[4px] top-[4px] max-h-fit">
        <div class="square-button" title="Upload new image" @click="fileInputRef.click()">
          <img src="/icons/img-edit.svg" />
        </div>
        <div class="square-button" title="Flip Horizontal" @click="flip(true, false)">
          <img src="/icons/flip-horizontal.svg" />
        </div>
        <div class="square-button" title="Flip Vertical" @click="flip(false, true)">
          <img src="/icons/flip-vertical.svg" />
        </div>
        <div class="square-button" title="Rotate Clockwise" @click="rotate(90)">
          <img src="/icons/rotate-clockwise.svg" />
        </div>
        <div class="square-button" title="Rotate Counter-Clockwise" @click="rotate(-90)">
          <img src="/icons/rotate-counter-clockwise.svg" />
        </div>
        <!-- <div class="square-button" title="Download" @click="download()">
          <img src="/icons/download.svg" />
        </div> -->
      </div>
    </div>
    <DropZone v-if="!loadedImageSrc" class="w-full" @files-dropped="filesDropped" @click="fileInputRef.click()">
      <template #default="{ dropZoneActive }">
        <div
          class="flex cursor-pointer items-center justify-center text-clip rounded-2xl border-2 border-dashed !border-primary text-center"
          :class="[
            state === ImageUploadState.EMPTY ? 'bg-[#EFF1F5]' : '',
            state !== ImageUploadState.EMPTY ? 'border border-[#EB5757]' : '',
            dropZoneActive ? dragStartClasses : dragLeaveClasses,
            props.dropzoneClasses,
          ]"
        >
          <div class="max-w-[80%] text-center text-[16px]" :class="state !== ImageUploadState.EMPTY ? 'text-[#EB5757]' : ''">
            {{ uploadText }}
          </div>

          <BaseLoader v-if="loading" :size="90" />
        </div>
      </template>
    </DropZone>
    <input ref="fileInputRef" hidden type="file" :accept="acceptFiles" @change="fileInputChange($event)" />
  </div>
</template>

<style lang="scss">
.cropper-wrapper {
  position: relative;
  user-select: none;
  margin: auto;
  background-color: black;
}
.square-button {
  background: rgba(black, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 42px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.5s;
  &:hover {
    background: black;
  }
  > img {
    width: 22px;
    height: 22px;
  }
}
</style>
