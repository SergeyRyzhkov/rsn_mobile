export class MapMarkerModel<TData> {
  coords: [number, number];
  uuid?: string;
  iconHref?: string;
  title?: string;
  data?: TData;
  imageSize? = [32, 32];
}
