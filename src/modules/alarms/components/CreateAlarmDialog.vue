<script setup lang="ts">
import BaseOKCancelModal from "@/_core/components/modal/BaseOKCancelModal.vue";
import CreateAlarm from "./CreateAlarm.vue";
</script>

<template>
  <BaseOKCancelModal ok-button-title="Создать">
    <CreateAlarm></CreateAlarm>
  </BaseOKCancelModal>
</template>
