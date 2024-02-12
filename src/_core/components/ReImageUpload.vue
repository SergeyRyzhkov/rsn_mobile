<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import ImageUploaderDialog from "@/_core/components/ImageUploaderDialog.vue";
import useModal from "./modal/useModal";

const emits = defineEmits(["on-upload", "on-delete"]);

const modal = useModal();

const imageBlob = ref<Blob | null>(null);
const imageSrc = ref("");
const imageFileName = ref("");

const uploadImage = async () => {
  const { blob, file } = await modal.show<{ blob: Blob; file: File }>(ImageUploaderDialog, {
    cropperProps: { imageSrc: imageSrc.value, format: ["jpg", "jpeg", "png"] },
  });

  if (!!blob) {
    imageBlob.value = blob;
    imageFileName.value = file?.name || imageFileName.value;
    if (!!imageBlob.value) {
      imageSrc.value = URL.createObjectURL(imageBlob.value);
      emits("on-upload", imageBlob.value);
    }
  } else {
    if (!!imageBlob.value) {
      imageSrc.value = URL.createObjectURL(imageBlob.value);
    }
  }
};

onUnmounted(() => {
  cleanImageResource();
});

const cleanImageResource = () => {
  imageBlob.value = null;
  imageSrc.value = "";
  imageFileName.value = "";
  if (!!imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value);
  }
};

const deleteImage = () => {
  cleanImageResource();
  emits("on-delete");
};

const getImageBlob = () => {
  return imageBlob.value;
};

defineExpose({ getImageBlob, cleanImageResource });
</script>

<template>
  <div class="flex w-[60px] max-w-[60px] flex-col">
    <button
      class="relative flex size-[60px] cursor-pointer flex-col items-center justify-between rounded-[5px] border border-[#b7dad9] p-[6px]"
      :class="[!!imageFileName ? '!border-primary !p-[1px]' : '']"
      @click="uploadImage()"
    >
      <img v-if="!imageFileName" src="/icons/gallery-add.svg" class="size-[16px]" />
      <span v-if="!imageFileName" class="text-10 text-[#C4CCD0]">Добавьте фото</span>

      <img v-if="!!imageFileName" :src="imageSrc" class="size-[55px] rounded-[5px] object-cover brightness-[55%]" />

      <img v-if="!!imageFileName" src="/icons/delete_image.svg" class="absolute inset-0 m-auto size-[24px]" @click.stop="deleteImage" />
    </button>
    <span class="mt-[2px] break-words text-10 line-clamp-2">{{ imageFileName }}</span>
  </div>
</template>
