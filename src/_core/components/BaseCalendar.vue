<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, defineAsyncComponent } from "vue";

const props = withDefaults(defineProps<{ showYear?: boolean }>(), { showYear: false });

const Datepicker = defineAsyncComponent(() => import("@vuepic/vue-datepicker"));

const isShowYearDisplay = computed(() => {
  return props.showYear ? "flex" : "none";
});
</script>

<template>
  <Datepicker locale="ru" :enable-time-picker="false" auto-apply month-name-format="long"></Datepicker>
</template>

<style lang="scss">
.dp__menu {
  border: 0px;
}

.dp__calendar {
  width: 100%;
}

.dp__calendar_header_separator {
  display: none;
}

.dp__calendar_wrap {
  align-items: baseline;
}

.dp__calendar_item {
  font-size: 14px;
}

.dp__month_year_select {
  color: $secondary;
  font-weight: 600;
  font-size: 16px;
}
.dp__month_year_select[aria-label="Open years overlay"] {
  display: v-bind(isShowYearDisplay);
  align-items: center;
  justify-content: center;
  margin-top: 17px;
}
.dp__month_year_select[aria-label="Open months overlay"] {
  width: 100%;
  text-transform: capitalize;
  font-size: 16px;
  font-weight: 600;
}
.dp__calendar_header {
  font-weight: 500;
  color: $secondary;
  width: 100%;
  .dp__calendar_header_item {
    text-transform: uppercase;
    font-size: 12px;
  }
}
.dp__inner_nav {
  color: $primary;
}
.dp__active_date {
  border-color: $primary;
  color: $primary;
  font-weight: 600;
  background-color: #e0f2f4;
}

.dp__input_readonly {
  color: $text-color !important;
  font-family: $font-famaly !important;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
}
</style>
