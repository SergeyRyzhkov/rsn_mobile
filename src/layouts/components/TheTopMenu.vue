<script setup lang="ts">
import MainActionButton from "@/layouts/components/MainActionButton.vue";
</script>

<template>
  <section class="flex flex-nowrap overflow-x-auto no-scrollbar mx-[-16px] px-[16px] justify-between">
    <MainActionButton title="Таймеры" img-src="/images/timers/timer_main.png" :route-props="{ name: 'timers-list' }"></MainActionButton>

    <MainActionButton
      title="Тренировки"
      img-src="/images/sport.png"
      bg-color="#7256b6"
      :route-props="{ name: 'timers-list' }"
      class="ml-[12px]"
    ></MainActionButton>

    <MainActionButton
      title="Погода"
      img-src="/images/weather/weather_main.png"
      bg-color="#00acef"
      :route-props="{ name: 'meteo-list' }"
      class="ml-[12px]"
    ></MainActionButton>

    <MainActionButton
      title="Календарь"
      img-src="/images/calendar.png"
      bg-color="#b846c5"
      :route-props="{ name: 'timers-list' }"
      class="ml-[12px]"
    ></MainActionButton>

    <MainActionButton
      title="Записи"
      img-src="/images/weather/weather_main.png"
      bg-color="#94a1fd"
      :route-props="{ name: 'timers-list' }"
      class="ml-[12px]"
    ></MainActionButton>
  </section>
</template>

<style lang="scss"></style>
