<script setup lang="ts">
import { ref, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    validCharactersOnly?: boolean;
    placeholder?: string;
    requred?: boolean;
  }>(),
  {
    modelValue: "",
    validCharactersOnly: true,
    placeholder: "Номер телефона",
    requred: true,
  },
);

const emits = defineEmits(["update:modelValue"]);

const AVAILABLE_COUNTRIES = ["BY", "UZ", "RU"];

interface CountryChangeParam {
  dialCode: string;
  name: string;
}

const isPhoneValid = ref(false);

const validatePhone = (data) => {
  if (AVAILABLE_COUNTRIES.includes(data.countryCode)) {
    isPhoneValid.value = data.valid;
  }
};

const countryChanged = (data: CountryChangeParam) => {
  emits("update:modelValue", `+${data.dialCode}`);
};

const tryEmitUpdateModel = (newValue: string) => {
  const newModelValue = isPhoneValid.value ? newValue : "";
  emits("update:modelValue", newModelValue);
};

const internalModel = ref();

watchEffect(() => {
  internalModel.value = props.modelValue;
});
</script>

<template>
  <div class="custom-tel-input">
    <vue-tel-input
      v-model="internalModel"
      :only-countries="AVAILABLE_COUNTRIES"
      default-country="RU"
      :class="!isPhoneValid ? 'has_error' : ''"
      mode="international"
      :valid-characters-only="true"
      :input-options="{
        placeholder: placeholder,
      }"
      @on-input="tryEmitUpdateModel"
      @country-changed="countryChanged"
      @validate="validatePhone"
    />
  </div>
</template>

<style lang="scss">
.custom-tel-input {
  .vue-tel-input {
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #c4ccd0;
    border-radius: 0;

    .vti__dropdown {
      padding-left: 0;
    }

    &:focus-within {
      box-shadow: none;
      border-bottom: 1px solid #c4ccd0;
    }
  }

  .has_error {
    border-bottom: 1px solid #eb5757;

    ::placeholder {
      color: #eb5757;
    }
  }
}
</style>
