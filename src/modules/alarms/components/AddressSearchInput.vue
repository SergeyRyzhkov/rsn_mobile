<script setup lang="ts">
import BaseSearchInput from "@/_core/components/forms/BaseSearchInput.vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "../services/AlarmEventService";
import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { AddressService } from "@/modules/main/services/AddressService";
import { Suggestion } from "@/modules/main/models/DadataSuggetionModel";

const loading = ref(false);
const searchPattern = ref("");
const searchResult = ref<Suggestion[] | null>();

const debonceSearch = (pattern: string) => {
  searchPattern.value = pattern;
  const debSearchFn = useDebounceFn(async () => {
    loading.value = true;
    if (!!searchPattern.value && searchPattern.value.length > 2) {
      searchResult.value = await ServiceLocator.instance.getService(AddressService).getSuggestions({ query: searchPattern.value });
    } else {
      searchResult.value = null;
    }
    loading.value = false;
  }, 800);

  debSearchFn();
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
  <div>
    <BaseSearchInput
      class="map-search-input-wrapper p-[2px]"
      placeholder="Поиск мест и адресов"
      @update:model-value="debonceSearch"
      @on-focus="searchOnFocus"
    ></BaseSearchInput>
    <div v-show="!!searchResult && !!searchResult.length" class="relative">
      <div v-for="(iter, index) in searchResult" :key="index">
        {{ iter.value }}
      </div>
    </div>
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
