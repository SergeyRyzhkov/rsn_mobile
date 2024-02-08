<script lang="ts">
type SwitchType = {
  width: number;
  height: number;
  padding: number;
};

const switchSizes: { [key: string]: SwitchType } = {
  small: {
    width: 38,
    height: 18,
    padding: 2,
  },

  medium: {
    width: 48,
    height: 22,
    padding: 2,
  },

  large: {
    width: 56,
    height: 25,
    padding: 3,
  },
};
</script>

<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue";

type ToggleProps = {
  modelValue?: boolean;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  size?: SwitchType;
};

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: false,
  medium: false,
  small: false,
  large: false,
  size() {
    return switchSizes.medium;
  },
});

const emit = defineEmits(["update:modelValue"]);

const currentState = ref<boolean>();

watchEffect(() => {
  currentState.value = props.modelValue;
});

const size = computed(() => {
  return props.small ? switchSizes.small : props.medium ? switchSizes.medium : props.large ? switchSizes.large : props.size;
});

const heightPx = computed(() => {
  return `${size.value.height}px`;
});

const widthPx = computed(() => {
  return `${size.value.width}px`;
});

const paddingPx = computed(() => {
  return `${size.value.padding}px`;
});

const switchWH = computed(() => {
  return `${size.value.height - 2 * size.value.padding}px`;
});

const onChange = () => {
  currentState.value = !currentState.value;
  emit("update:modelValue", currentState.value);
};
</script>

<template>
  <div class="base-toggle" @click="onChange()">
    <input type="checkbox" :checked="currentState" />
    <span></span>
  </div>
</template>

<style lang="scss">
.base-toggle {
  display: flex;
  input[type="checkbox"] {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  span {
    cursor: pointer;
    width: v-bind(widthPx);
    height: v-bind(heightPx);
    background: lightgrey;
    display: block;
    border-radius: 9999999px;
    position: relative;
  }

  span:after {
    content: "";
    position: absolute;
    top: v-bind(paddingPx);
    left: v-bind(paddingPx);
    width: v-bind(switchWH);
    height: v-bind(switchWH);
    background: #fff;
    border-radius: 9999999px;
    transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
  }

  input:checked + span {
    background: $secondary;
  }

  input:checked + span:after {
    left: calc(100% - v-bind(paddingPx));
    transform: translateX(-100%);
  }

  span:active:after {
    width: calc(v-bind(widthPx) - 40%);
  }
}
</style>
