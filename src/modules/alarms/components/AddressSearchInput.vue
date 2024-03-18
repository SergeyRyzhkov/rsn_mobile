<script setup lang="ts">
import BaseSearchInput from "@/_core/components/forms/BaseSearchInput.vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "../services/AlarmEventService";
import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";

const loading = ref(false);
const searchPattern = ref("");
const searchResult = ref();

const debonceSearch = useDebounceFn(async () => {
  loading.value = true;
  if (!!searchPattern.value && searchPattern.value.length > 2) {
    ServiceLocator.instance.getService(AlarmEventService).findAddress("Мурино Шувалова 27");
  } else {
    searchResult.value = null;
  }
  loading.value = false;
}, 800);

const search = async (pattern: string) => {
  loading.value = true;
  // resultVisible.value = true;
  // appStore.doctorSerachPattern = pattern;
  debonceSearch();
};

const searchOnFocus = () => {
  // if (!!appStore.doctorSerachPattern && appStore.doctorSerachPattern.length > 2 && doctorList.value?.length === 0) {
  //   loading.value = true;
  //   doSearch();
  // } else {
  //   resultVisible.value = true;
  // }
};
</script>

<template>
  <div class="map-search-input-wrapper h-fit">
    <BaseSearchInput
      class="p-[2px]"
      placeholder="Поиск мест и адресов"
      @update:model-value="search"
      @on-focus="searchOnFocus"
    ></BaseSearchInput>
    <div v-show="!!searchResult" class="relative"></div>
  </div>
</template>

<style lang="scss">
.map-search-input-wrapper {
  transition: all;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 10px;
}
</style>
