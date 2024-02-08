<script setup lang="ts">
import { defineAsyncComponent, DefineComponent, ref, toRaw } from "vue";
// import ImageUploader from "@/components/ImageUploader.vue";
import BaseModal from "@/_core/components/modal/BaseModal.vue";
import ImageUploader from "@/_core/components/ImageUploader.vue";

const baseImageCropperRef = ref();
const loading = ref(false);

defineProps<{
  imageSrc?: string;
  circle?: boolean;
  cropperProps?: any;
}>();

const submitResult = (resolve, close) => {
  loading.value = true;
  const canvas = baseImageCropperRef.value.getCanvas();
  const file = baseImageCropperRef.value.getFile();
  const blobType = file?.type || "image/jpeg";
  if (!!canvas) {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, file });
          loading.value = false;
          close();
        }
      },
      blobType,
      0.9,
    );
  }
};
</script>

<template>
  <BaseModal
    submit-button-name="Применить"
    title="Измените размер и позицию изображения"
    modal-classes="!max-h-[95vh]"
    :loading="loading"
    :ok-button-disabled="loading"
    @on-submit="submitResult"
  >
    <template #content>
      <ImageUploader ref="baseImageCropperRef" :image-src="imageSrc" :circle="circle" v-bind="cropperProps" image-restriction="stencil" />
    </template>
  </BaseModal>
</template>
