<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  name?: string;
  value?: string | number;
  modelValue?: any;
  color?: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const colorCss = computed(() => {
  return props.color || "#ec62b5";
});

const isChecked = computed(() => props.modelValue === props.value);

const onChange = () => {
  emit("update:modelValue", props.value);
};
</script>
<template>
  <div @click="onChange()">
    <label class="base-radio-button">
      <input type="radio" :name="name" :checked="isChecked" />
      <span class="label"></span>{{ label }}
    </label>
  </div>
</template>

<style lang="scss">
.base-radio-button {
  > input {
    display: none;
  }
  padding: 5px 0;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;

  .label {
    position: relative;
    display: block;
    float: left;
    margin-right: 7px;
    width: 20px;
    height: 20px;
    border: 1px solid #c9c9c9;
    border-radius: 100%;
    -webkit-tap-highlight-color: transparent;

    &:after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 12px;
      height: 12px;
      border-radius: 100%;
      background: v-bind(colorCss);
      transform: scale(0);
      transition: all 0.2s ease;
      opacity: 0.08;
      pointer-events: none;
    }
    &:hover {
      .label:after {
        transform: scale(3.6);
      }
    }
  }
}
input[type="radio"]:checked + .label {
  border-color: #c9c9c9;
  &:after {
    transform: scale(1);
    transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
    opacity: 1;
  }
}
</style>
