import { EventFile } from "./EventFile";
import { GeoPosition } from "./../../capacitor/useGeolocation";

export interface EventGeoPosition extends GeoPosition {
  files?: EventFile[];
}
