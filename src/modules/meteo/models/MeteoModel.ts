export class MeteoModel {
  time;
  temperature2m;
  apparentTemperature: number;
  relativeHumidity2m: number;
  precipitationProbability: number;
  precipitation;
  rain;
  showers;
  snowfall;
  surfacePressure: number;
  cloudCover: number;
  visibility;
  windSpeed10m;
  windDirection10m;
  weatherCode: any;

  public constructor(init?: Partial<MeteoModel>) {
    Object.assign(this, init);
  }
}
