import { computed } from "vue";
import { MeteoModel } from "./../models/MeteoModel";

export const useMeteoDescription = (data: MeteoModel) => {
  const apparentTemperature = computed(() => {
    return data.apparentTemperature.toFixed(0);
  });

  const apparentTemperatureText = computed(() => {
    return `Ощущается как ${data.apparentTemperature.toFixed(0)}`;
  });

  const surfacePressureText = computed(() => {
    return `${data.surfacePressure.toFixed(0)} мм рт. ст.`;
  });

  const relativeHumidity2mText = computed(() => {
    return `${data.relativeHumidity2m.toFixed(0)}%`;
  });

  const cloudCoverText = computed(() => {
    return `${data.cloudCover.toFixed(0)}%`;
  });

  const weatherCode = computed(() => {
    return `${data.weatherCode}`;
  });

  return {
    apparentTemperatureText,
    apparentTemperature,
    surfacePressureText,
    relativeHumidity2mText,
    cloudCoverText,
    weatherCode,
  };
};
