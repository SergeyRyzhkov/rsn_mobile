import { EventGeoPosition } from "./EventGeoPosition";
import { AlarmEvent } from "./AlarmEvent";
import { AppUser } from "./AppUser";

export enum EventMemberStatus {
  PRESENT_100,
  PRESENT_50,
  NOT_PRESENT,
}

export interface EventMember {
  event: AlarmEvent;
  user: AppUser;
  isMain: boolean;
  estimatedArrivalTime?: number;
  geoTrack?: EventGeoPosition[];
  willStatus?: EventMemberStatus;
  factStatus?: EventMemberStatus;
}
