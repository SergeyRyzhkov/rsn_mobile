<script setup lang="ts">
import { ref, shallowRef, triggerRef } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { AlarmEventService } from "../services/AlarmEventService";
import { EventType } from "../models/EventTypes";
import { AlarmEvent } from "../models/AlarmEvent";
import BaseChip from "@/_core/components/forms/BaseChip.vue";
import BaseInput from "@/_core/components/forms/BaseInput.vue";
import VideoRecorder from "@/modules/capacitor/components/VideoRecorder.vue";
import BaseButton from "@/_core/components/forms/BaseButton.vue";

const alarmEvent = ref<AlarmEvent>(new AlarmEvent());
const eventTypeList = ref<EventType[]>([]);

const videoShow = ref(false);

const isTypeSelected = (type: EventType) => {
  return !!alarmEvent.value.type ? alarmEvent.value.type.id === type.id : false;
};

const loadData = async () => {
  eventTypeList.value = await ServiceLocator.instance.getService(AlarmEventService).getDefaultAlarmEventTypeList();
};
loadData();

const changeType = (type: EventType) => {
  alarmEvent.value.type = type;
};
</script>

<template>
  <div>
    <section class="flex items-center flex-wrap">
      <template v-for="iter in eventTypeList" :key="iter.id">
        <BaseChip :text="iter.title" class="mr-[12px] mb-[12px]" :selected="isTypeSelected(iter)" @on-select="changeType(iter)"></BaseChip>
      </template>
    </section>

    <section>
      <BaseInput v-model="alarmEvent.description" type="textarea" placeholder="Что случилось?"></BaseInput>
    </section>

    <BaseButton @click="videoShow = !videoShow">{{ videoShow }}</BaseButton>

    <VideoRecorder v-if="!!videoShow" :show="videoShow"></VideoRecorder>
  </div>
</template>
