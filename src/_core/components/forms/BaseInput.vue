<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useAttrs, watchEffect } from "vue";

const showPassword = ref(false);
const maskFiled = ref<HTMLInputElement | any>();
const textarea = ref<HTMLTextAreaElement>();
const showLabelInTextarea = ref(true);

const currentMaskValue = ref("");

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    mask?: any;
    triggerOnlyValidMaskValue?: boolean;
    type?: string;
    modelValue?: any;
    isShakeError?: boolean;
    label?: string;
    help?: string;
    errorMessage?: string;
    hasError?: boolean;
    classes?: string;
  }>(),
  { triggerOnlyValidMaskValue: true, type: "text", isShakeError: true },
);

const emit = defineEmits(["update:modelValue", "input"]);

onMounted(async () => {
  resizeTextarea();
  await nextTick();
  if (!!props.modelValue && !!maskFiled?.value?.maskRef) {
    maskFiled.value.maskRef.typedValue = String(props.modelValue);
    maskFiled.value.maskRef.unmaskedValue = String(props.modelValue);
  }
});

const onInput = async (e) => {
  if (!!textarea.value) {
    emit("update:modelValue", e.target.value);
    emit("input", e.target.value);
    return;
  }

  if (!maskFiled.value.maskRef) {
    emit("update:modelValue", e.target.value);
    emit("input", e.target.value);
    return;
  }

  if (!!maskFiled?.value && !!maskFiled?.value.maskRef && !props.triggerOnlyValidMaskValue) {
    emit("update:modelValue", maskFiled.value.maskRef.unmaskedValue);
    emit("input", e.target.value);
  }
};

const onDelete = async (e) => {
  if (!!maskFiled.value.maskRef && props.triggerOnlyValidMaskValue) {
    const prevValue = maskFiled.value.maskRef.value;
    const prevUnmaskedValue = maskFiled.value.maskRef.unmaskedValue;
    if (!!e?.target?.maskRef) {
      emit("update:modelValue", "");
    }

    maskFiled.value.maskRef.value = prevValue;
    maskFiled.value.maskRef.unmaskedValue = prevUnmaskedValue;
  }
};

const isMaskFill = computed(() => {
  return !!props?.modelValue || !!currentMaskValue.value || (!!props.mask && !props.mask?.lazy);
});

const labelText = computed(() => attrs.placeholder || props.label);

const onComplete = async () => {
  if (!!maskFiled.value.maskRef) {
    const temp = maskFiled.value.maskRef.unmaskedValue;
    emit("update:modelValue", maskFiled.value.maskRef.unmaskedValue);
    currentMaskValue.value = temp;
  }
};

const currentClasses = computed(() => {
  return {
    "base-input__input--error": props.hasError,
    "base-input__input--help": !!props.help,
  };
});

const resizeTextarea = () => {
  if (!!textarea.value) {
    textarea.value.style.height = "30px";
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

const onAccept = () => {
  currentMaskValue.value = maskFiled?.value?.maskRef?.value;
};

const inputValue = computed(() => {
  return !!props.modelValue ? props.modelValue : currentMaskValue.value;
});

onUnmounted(() => {
  if (!!maskFiled?.value?.maskRef) {
    maskFiled.value.maskRef.destroy();
    delete maskFiled.value.maskRef;
  }
});

defineExpose({ maskFiled });
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': isShakeError && hasError }">
    <textarea
      v-if="type === 'textarea'"
      ref="textarea"
      :value="modelValue"
      v-bind="{
        ...$attrs,
        ...{ class: [currentClasses, 'base-input__input', classes] },
        ...{ placeholder: '' },
      }"
      :class="['resize-none overflow-hidden !px-0 !pb-[4px] !pt-[24px]']"
      @keydown.enter.stop
      @keyup.enter.stop
      @input="
        (event) => {
          onInput(event);
          resizeTextarea();
        }
      "
      @focusin="showLabelInTextarea = false"
      @focusout="
        {
          resizeTextarea();
          showLabelInTextarea = true;
        }
      "
    ></textarea>
    <input
      v-else
      ref="maskFiled"
      :value="inputValue"
      :type="props.type === 'password' && showPassword ? '' : props.type"
      v-bind="{
        ...$attrs,
        ...{
          class: [
            '!px-[0px] !pt-[20px] !pb-[2px]',
            currentClasses,
            'base-input__input',
            classes,
            props.type === 'password' ? '!pr-[64px] !md:pr-[30px]' : '',
            isMaskFill ? '!border-b-[#1f2023] border-b' : '',
          ],
        },
        ...{ placeholder: '' },
      }"
      @input="(event) => onInput(event)"
      @keyup.delete="onDelete"
      @complete="onComplete"
      @accept="onAccept"
    />
    <label
      v-if="!!labelText && showLabelInTextarea"
      class="base-input__label"
      :class="[isMaskFill ? '!left-0 !top-[6px] !text-[12px]' : '']"
      @click.stop="
        {
          if (!!maskFiled) maskFiled.focus();
          if (!!textarea) textarea.focus();
        }
      "
      >{{ labelText }}</label
    >
    <a
      v-if="type === 'password'"
      href="#"
      class="z-100 absolute right-0 top-[50%] translate-y-[-50%]"
      @click.prevent="showPassword = !showPassword"
    >
      <img v-show="showPassword" src="/icons/eye-open.svg" width="28" height="28" />
      <img v-show="!showPassword" src="/icons/eye-close.svg" width="28" height="28" />
    </a>

    <slot></slot>
    <transition name="fade">
      <div v-if="!!props.help" class="base-input__help">{{ props.help }}</div>
    </transition>
    <transition name="fade">
      <div v-if="props.hasError" class="base-input__error">
        {{ props.errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.base-input {
  position: relative;
  width: 100%;

  &__wrap {
    position: relative;
  }

  &--error {
    animation-name: shakeError;
    animation-fill-mode: forwards;
    animation-duration: 0.6s;
    animation-timing-function: ease-in-out;
  }

  &__input {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    font-size: 15px;
    line-height: 20px;
    padding-bottom: 14px;
    padding-top: 17px;
    // border-radius: 4px;
    border-bottom: 1px solid #c4ccd0;

    &:hover {
      // border: 1px solid #b0b0b0;
    }

    &--error {
      border-bottom: 1px solid #eb5757;
    }
    &--help {
      border-bottom: 1px solid #3068f7;
    }

    &--error + label {
      color: #eb5757;
    }
    &:focus {
      border-bottom: 1px solid #1f2023;
      outline: none;
      padding: 24px 0px 8px 16px;
    }

    &:focus + label {
      font-size: 12px;
      line-height: 14px;
      top: 6px;
      left: 0px;
    }
    &:disabled {
      background-color: white;
      color: $text-color;
    }
  }

  &__label {
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    display: block;
    position: absolute;
    left: 0px;
    top: 18px;
    -webkit-transition: 0.2s;
    transition: 0.2s;
    color: #b0b0b0;
    cursor: text;
  }

  &__help {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #3068f7;
    position: absolute;
    top: 4px;
    left: 0px;
  }

  &__error {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #eb5757;
    position: absolute;
    margin-top: 2px;
    left: 0px;
  }
}
@keyframes shakeError {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0.375rem);
  }
  30% {
    transform: translateX(-0.375rem);
  }
  45% {
    transform: translateX(0.375rem);
  }
  60% {
    transform: translateX(-0.375rem);
  }
  75% {
    transform: translateX(0.375rem);
  }
  90% {
    transform: translateX(-0.375rem);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
