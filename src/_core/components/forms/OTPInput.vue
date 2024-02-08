<script setup lang="ts">
import { nextTick, onMounted, ref, watchEffect } from "vue";

// TODO: Move to utils
enum KeyboardKeyEnum {
  ArrowDown = "ArrowDown",
  ArrowRight = "ArrowRight",
  ArrowLeft = "ArrowLeft",
  Tab = "Tab",
  Backspace = "Backspace",
}

const props = withDefaults(defineProps<{ modelValue?: string; digitCount?: number; inputClasses?: string }>(), { digitCount: 4 });
const emit = defineEmits(["update:modelValue", "on-complete", "on-uncomplete"]);

const numRegExp = new RegExp("^([0-9])$");

const inputRefs = ref<HTMLInputElement[]>([]);
const digits = ref<string[] | null[]>([]);

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const focusIndex =
    event.key === KeyboardKeyEnum.Backspace || event.key === KeyboardKeyEnum.ArrowLeft
      ? index !== 0
        ? index - 1
        : index
      : event.key === KeyboardKeyEnum.ArrowRight
        ? index !== props.digitCount - 1
          ? index + 1
          : index
        : index;
  digits.value[focusIndex] = null;
  inputRefs.value[focusIndex].focus();
  emit("on-uncomplete");
};

const handleInput = (event, index: number) => {
  if (numRegExp.test(event.target.value)) {
    if (index !== props.digitCount - 1) {
      inputRefs.value[index + 1].focus();
    }
    if (!digits.value.some((iter) => !iter)) {
      const result = digits.value.join("");
      emit("update:modelValue", result);
      emit("on-complete", result);
    }
  } else {
    digits.value[index] = null;
  }
};

onMounted(async () => {
  await nextTick();
  inputRefs.value[0].focus();
});

watchEffect(() => {
  const pure = props.modelValue?.replace(/\D/g, "");
  const propArray = pure?.split("").slice(0, props.digitCount);

  digits.value = new Array(props.digitCount).fill(null);
  if (!!propArray?.length) {
    digits.value.splice(0, propArray?.length, ...propArray);
  }
});
</script>

<template>
  <div>
    <input
      v-for="index in digitCount"
      :key="index"
      ref="inputRefs"
      v-model="digits[index - 1]"
      class="digit-box"
      type="tel"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :class="[!!digits[index - 1] ? 'bounce' : '', inputClasses]"
      @input="handleInput($event, index - 1)"
      @keydown="handleKeyDown($event, index - 1)"
    />
  </div>
</template>

<style lang="scss">
.digit-box {
  border: 2px solid black;
  border-radius: 5px;
  font-size: 1.5rem;
}
.digit-box:focus,
.digit-box:active {
  border: 2px solid $primary;
  // outline: 2px solid $primary;
  outline: none;
  border-radius: 5px;
  box-shadow: 0 0 0px 2px $primary;
}

.bounce {
  border: 1px solid $primary !important;
  animation: pulse 0.3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
