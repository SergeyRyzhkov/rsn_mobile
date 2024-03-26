import { EventType } from "./EventTypes";
import { GeoPosition } from "./../../capacitor/useGeolocation";
import { EventFile } from "./EventFile";
import { EventMember } from "./EventMember";

export class AlarmEvent {
  id: string;
  title: string;
  description: string;
  files: EventFile[] = [];
  members: EventMember[] = [];
  geoPosition: GeoPosition;
  type: EventType;

  public constructor(init?: Partial<AlarmEvent>) {
    Object.assign(this, init);
  }
}
