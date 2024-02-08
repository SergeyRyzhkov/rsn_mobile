<script lang="ts" setup>
import { computed, ref, useSlots, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import BaseButton from "@/_core/components/forms/BaseButton.vue";

const props = withDefaults(
  defineProps<{
    show?: boolean;
    showClose?: boolean;
    showCancel?: boolean;
    showOk?: boolean;
    okButtonDisabled?: boolean;
    clickOutside?: boolean;
    modalClasses?: string;
    overlayClasses?: string;
    contentClasses?: string;
    loading?: boolean;
    title?: string;
    subTitle?: string;
    submitButtonName?: string;
    cancelButtonName?: string;
    resolve?: () => void;
    zIndex?: number;
    okButtonClass?: string;
    buttonWrapperClass?: string;
    cancelBtnClasses?: string;
    bottomPosition?: boolean;
  }>(),
  {
    show: false,
    showClose: true,
    showCancel: true,
    showOk: true,
    okButtonDisabled: false,
    clickOutside: true,
    modalClasses: "",
    cancelButtonName: "Отмена",
    submitButtonName: "OK",
    loading: false,
    zIndex: 999999999,
    okButtonClass: "",
    buttonWrapperClass: "",
    cancelBtnClasses: "",
    bottomPosition: false,
  },
);

const slots = useSlots();

const emit = defineEmits(["close", "on-submit", "on-cancel"]);

const modal = ref(null);
const showModal = ref(false);

const changeOverflow = (value: boolean) => {
  document.documentElement.style.overflowY = value ? "hidden" : "auto";
};

const contentExists = computed(() => {
  return !!slots.content;
});

const getZIndex = computed(() => {
  return props.zIndex;
});

watch(
  () => props.show,
  (newValue, oldValue) => {
    showModal.value = newValue;
    changeOverflow(newValue);

    if (oldValue && !newValue) {
      emit("close");
    }
  },
  { immediate: true },
);

onClickOutside(modal, () => {
  if (props.clickOutside) {
    closeModal();
  }
});

const okClicked = (resolve, close) => {
  emit("on-submit", resolve, close);
};

const cancelClicked = (resolve, close) => {
  emit("on-cancel", resolve, close);
  if (!!resolve) {
    resolve(false);
  }
  if (!!close) {
    close();
  }
};

const closeModal = () => {
  showModal.value = false;
  changeOverflow(false);
  emit("close");
};

defineExpose({ closeModal });
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Teleport to="#app">
    <div v-if="showModal" :class="['fixed inset-0 flex', 'z-[99999]']" @keyup.enter="okClicked(resolve, closeModal)">
      <div class="fixed inset-0" :class="['bg-black opacity-40 ', props.overlayClasses]"></div>
      <div
        ref="modal"
        :class="[
          'modal-content shadow-panel relative m-auto flex max-h-[90vh] flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all',
          props.modalClasses,
          !!bottomPosition ? 'mb-0' : '',
        ]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="flex items-start justify-between pb-[8px]">
          <slot name="header" :close="closeModal" :resolve="resolve"></slot>
          <span
            v-if="!!title"
            class="mx-auto mt-[8px] grow pl-[20px] text-center text-[16px] font-semibold leading-24 md:pl-[32px] md:text-[18px]"
          >
            {{ title }}
          </span>
          <span
            v-if="props.showClose"
            class="m-[10px] !ml-auto flex cursor-pointer items-center justify-center pl-[10px] text-[28px] leading-14 text-gray-500 transition-all after:content-['\00d7'] hover:text-gray-800 md:m-[12px]"
            @click="
              () => {
                closeModal();
              }
            "
          ></span>
        </div>

        <div
          v-if="!!subTitle"
          class="mx-[16px] text-center text-14 text-gray-700/80 md:mx-[24px] md:text-16"
          :class="[title ? 'mt-[18px] md:mt-[24px]' : '']"
          v-html="subTitle"
        ></div>

        <div
          v-if="contentExists"
          :class="[
            'ml-[18px] mr-[6px] mt-[6px] grow overflow-y-auto py-[18px] pr-[16px] md:ml-[24px] md:mt-[12px] md:pr-[18px]',
            props.contentClasses,
          ]"
        >
          <slot name="content" :close="closeModal" :resolve="resolve"></slot>
        </div>

        <slot name="footer" :close="closeModal" :resolve="resolve"></slot>

        <div
          v-if="showCancel || showOk"
          class="mx-[18px] mb-[16px] mt-auto flex items-center justify-center pt-[8px] md:mx-[24px] md:mb-[18px] md:pt-[16px]"
          :class="buttonWrapperClass"
        >
          <BaseButton v-if="showCancel" type="button" gray :class="cancelBtnClasses" @click="cancelClicked(resolve, closeModal)">{{
            cancelButtonName
          }}</BaseButton>
          <BaseButton
            v-if="showOk"
            :class="okButtonClass"
            class="ml-[18px]"
            type="submit"
            :loading="loading"
            :disabled="okButtonDisabled"
            @click="okClicked(resolve, closeModal)"
            >{{ submitButtonName }}</BaseButton
          >
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.modal-content {
  animation: modal_scale_animation 0.25s linear 0s;
}

@keyframes modal_scale_animation {
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
</style>
