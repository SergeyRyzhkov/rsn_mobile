export class MapMarkerModel<TData> {
  uuid?: string;
  iconHref?: string;
  title?: string;
  latitude?: number;
  longitude?: number;
  data?: TData;
  imageSize = [38, 38];
}
