<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  modelValue?: boolean;
  labelClasses?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const labelPadding = computed(() => {
  return !!props.label ? "0 18px" : "0 0 0 18px";
});

const onChange = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <div class="base-checkbox-new" @click.prevent.stop="onChange()">
    <input type="checkbox" :checked="modelValue" />
    <span class="base-checkbox-new-label" :class="labelClasses">{{ label }}</span>
  </div>
</template>

<style lang="scss">
.base-checkbox-new {
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  &-label {
    margin-left: 12px;
    margin-top: 5px;
    padding: v-bind(labelPadding);
    user-select: none;
    cursor: pointer;
    // white-space: nowrap;
  }

  input[type="checkbox"] {
    height: 100%;
    opacity: 0;
    position: absolute;
    outline: none;
    width: 100%;
    z-index: -1;

    & + span:before {
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      width: 24px;
      height: 24px;
      border: 1px solid #ecf2f2;
      background-color: #ecf2f2;
      border-radius: 4px;
    }

    & + span:after {
      opacity: 0;
      content: "";
      position: absolute;
      transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
      left: 5px;
      top: 8px;
      width: 16px;
      height: 8px;
      border-radius: 1px;
      border-left: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(-45deg);
    }

    &:checked + span:after {
      opacity: 1;
      transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
    }

    &:checked + span:before {
      border: 1px solid $primary;
      background-color: $primary;
    }
  }
}
</style>
