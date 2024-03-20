export const BOUNDS = {
  COUNTRY: "country" as const,
  REGION: "region" as const,
  AREA: "area" as const,
  CITY: "city" as const,
  SETTLEMENT: "settlement" as const,
  STREET: "street" as const,
  HOUSE: "house" as const,
  FLAT: "flat" as const,
};

export type CapitalMarkerType = "0" | "1" | "2" | "3" | "4";
export type QCGeoType = "0" | "1" | "2" | "3" | "4" | "5";
export type BoundsType = keyof typeof BOUNDS;

export interface LocationOptions {
  language?: string;
  locations: object[];
  locationsBoost?: object[];
}

export interface SuggestionQuery {
  query: string;
  count?: number;
  toBound?: BoundsType;
  fromBound?: BoundsType;
  locationOptions?: LocationOptions;
}

export interface SuggestionPayload {
  query: string;
  count?: number;
  to_bound?: { value: BoundsType };
  from_bound?: { value: BoundsType };
  language?: string;
  locations?: object[];
  locations_boost?: object;
}

export interface Suggestion {
  value: string;
  unrestricted_value: string;
  data: DadataAddress;
}

export interface DadataAddress {
  area: string;
  area_fias_id: string;
  area_kladr_id: string;
  area_type: string;
  area_type_full: string;
  area_with_type: string;
  beltway_distance: null;
  beltway_hit: null;
  block: string;
  block_type: string;
  block_type_full: string;
  capital_marker: CapitalMarkerType;
  city: string;
  city_area: string;
  city_district: string;
  city_district_fias_id: string;
  city_district_kladr_id: string;
  city_district_type: string;
  city_district_type_full: string;
  city_district_with_type: string;
  city_fias_id: string;
  city_kladr_id: string;
  city_type: string;
  city_type_full: string;
  city_with_type: string;
  country: string;
  fias_id: string;
  fias_level: string;
  flat: string;
  flat_area: null;
  flat_price: null;
  flat_type: string;
  flat_type_full: string;
  geo_lat: string;
  geo_lon: string;
  history_values: string;
  house: string;
  house_fias_id: string;
  house_kladr_id: string;
  house_type: string;
  house_type_full: string;
  kladr_id: string;
  okato: string;
  oktmo: string;
  postal_box: string;
  postal_code: string;
  qc: null;
  qc_complete: null;
  qc_geo: QCGeoType;
  qc_house: null;
  region: string;
  region_fias_id: string;
  region_kladr_id: string;
  region_type: string;
  region_type_full: string;
  region_with_type: string;
  settlement: string;
  settlement_fias_id: string;
  settlement_kladr_id: string;
  settlement_type: string;
  settlement_type_full: string;
  settlement_with_type: string;
  source: string;
  square_meter_price: null;
  street: string;
  street_fias_id: string;
  street_kladr_id: string;
  street_type: string;
  street_type_full: string;
  street_with_type: string;
  tax_office: string;
  tax_office_legal: string;
  timezone: null;
  unparsed_parts: null;
}
