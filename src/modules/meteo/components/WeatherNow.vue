<script setup lang="ts">
import { useMeteoDescription } from "../composables/useMeteoDescription";
import { MeteoModel } from "../models/MeteoModel";

const props = defineProps<{ model: MeteoModel }>();

const desription = useMeteoDescription(props.model);
</script>

<template>
  <section>
    {{ desription.apparentTemperatureText }}
    <br />
    {{ desription.surfacePressureText }}
    <br />
    {{ desription.relativeHumidity2mText }}
    <br />
    {{ desription.cloudCoverText }}
    <br />
    {{ desription.weatherCode }}
    <br />
  </section>
</template>
