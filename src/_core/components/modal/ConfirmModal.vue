<script setup lang="ts">
import BaseModal from "@/_core/components/modal/BaseModal.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";

withDefaults(defineProps<{ title?: string; message?: string; okButtonTitle?: string; cancelButtonTitle?: string }>(), {
  title: "Внимание",
  message: "",
  buttonText: "OK",
  cancelButtonTitle: "Отмена",
});

const onOk = (resolve, close) => {
  resolve(true);
  close();
};

const onCancel = (resolve, close) => {
  resolve(false);
  close();
};
</script>

<template>
  <BaseModal :show-cancel="false" :show-ok="false" modal-classes="max-w-[90vw]" :title="title">
    <template #content="{ close, resolve }">
      <div class="flex flex-col text-14">
        <span class="font-medium" v-html="message"></span>
        <div class="flex items-center justify-center mt-[32px]">
          <BaseButton class="w-full" inner-class="!my-[10px]" gray @click="onCancel(resolve, close)">{{ cancelButtonTitle }}</BaseButton>
          <BaseButton class="ml-[24px] !w-full" inner-class="!my-[10px]" @click="onOk(resolve, close)">{{ okButtonTitle }}</BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
