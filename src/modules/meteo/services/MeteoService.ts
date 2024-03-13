import { MeteoModel } from "./../models/MeteoModel";
import { BaseService } from "@/_core/service/BaseService";
import { fetchWeatherApi } from "openmeteo";

export class MeteoService extends BaseService {
  url = "https://api.open-meteo.com/v1/forecast";

  async getWeatherDataNow() {
    const data = await this.getWeatherData();
    return data[0];
  }

  async getWeatherData() {
    const params = {
      latitude: 60.066624,
      longitude: 30.434105,
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation_probability",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "surface_pressure",
        "cloud_cover",
        "visibility",
        "wind_speed_10m",
        "wind_direction_10m",
        "cloud_cover",
      ],
      wind_speed_unit: "ms",
      timezone: "Europe/Moscow",
      models: "best_match",
    };

    const responses = await fetchWeatherApi(this.url, params);
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    const weatherData = {
      time: this.createRange(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000),
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
      apparentTemperature: hourly.variables(2)!.valuesArray()!,
      precipitationProbability: hourly.variables(3)!.valuesArray()!,
      precipitation: hourly.variables(4)!.valuesArray()!,
      rain: hourly.variables(5)!.valuesArray()!,
      showers: hourly.variables(6)!.valuesArray()!,
      snowfall: hourly.variables(7)!.valuesArray()!,
      surfacePressure: hourly.variables(8)!.valuesArray()!,
      cloudCover: hourly.variables(9)!.valuesArray()!,
      visibility: hourly.variables(10)!.valuesArray()!,
      windSpeed10m: hourly.variables(11)!.valuesArray()!,
      windDirection10m: hourly.variables(12)!.valuesArray()!,
      weatherCode: hourly.variables(13)!.valuesArray()!,
    };

    const result: MeteoModel[] = [];

    for (let i = 0; i < weatherData.time.length; i++) {
      result.push(
        new MeteoModel({
          time: weatherData.time[i].toISOString(),
          temperature2m: weatherData.temperature2m[i],
          relativeHumidity2m: weatherData.relativeHumidity2m[i],
          apparentTemperature: weatherData.apparentTemperature[i],
          precipitationProbability: weatherData.precipitationProbability[i],
          precipitation: weatherData.precipitation[i],
          rain: weatherData.rain[i],
          showers: weatherData.showers[i],
          snowfall: weatherData.snowfall[i],
          surfacePressure: weatherData.surfacePressure[i] * 0.750062,
          cloudCover: weatherData.cloudCover[i],
          visibility: weatherData.visibility[i],
          windSpeed10m: weatherData.windSpeed10m[i],
          windDirection10m: weatherData.windDirection10m[i],
          weatherCode: weatherData.weatherCode[i],
        }),
      );
    }

    return result;
  }

  private createRange(start: number, stop: number, step: number) {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  }
}
