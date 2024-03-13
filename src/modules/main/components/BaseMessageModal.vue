<script setup lang="ts">
import BaseModal from "@/_core/components/modal/BaseModal.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";

withDefaults(defineProps<{ title?: string; text?: string; buttonText?: string }>(), {
  title: "Внимание!",
  text: "",
  buttonText: "OK",
});
</script>

<template>
  <BaseModal :show-cancel="false" :show-ok="false" :show-close="false" modal-classes="max-w-[90vw]">
    <template #content="{ close }">
      <div class="flex flex-col text-13">
        <span class="text-center text-16 font-medium text-primary">{{ title }}</span>
        <span class="mt-[16px] text-center font-medium" v-html="text"></span>
        <BaseButton class="mt-[24px]" @click="close()">{{ buttonText }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
