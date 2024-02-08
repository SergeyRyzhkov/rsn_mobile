import { loadYmap } from "vue-yandex-maps";

const mapSettings = {
  apiKey: "26d989de-9503-4650-bc42-2bfad0128a78",
  lang: "ru_RU",
  coordorder: "latlong",
  version: "2.1",
  controls: [],
};

export const geocodeCity = async (lat, lng) => {
  try {
    await loadYmap({ ...mapSettings, debug: true });
    //@ts-ignore
    const yandexResult = await window.ymaps.geocode([lat, lng], {
      json: true,
      kind: "locality",
      results: 1,
    });
    const cityName =
      yandexResult.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country
        .AdministrativeArea.AdministrativeAreaName;
    return cityName;
  } catch {
    return null;
  }
};
