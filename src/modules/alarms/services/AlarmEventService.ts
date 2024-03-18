import { BaseService } from "@/_core/service/BaseService";
import { AlarmEvent } from "../models/AlarmEvent";
import { AppUser } from "../models/AppUser";
import { FirebaseStorage } from "@/modules/firebase/FirebaseStorage";
import { Guid } from "@/_core/utils/Guid";
import { EventMember, EventMemberStatus } from "../models/EventMember";
import { GeoPosition } from "@/modules/capacitor/useGeolocation";
import { EventGeoPosition } from "../models/EventGeoPosition";

export class AlarmEventService extends BaseService {
  DB_PATH = "ro_db/alarm_events";

  storage = new FirebaseStorage();

  findAddress(address: string) {
    const config: any = {};
    config.headers = {};
    config.headers = {
      Accept: "application/json",
    };
    config.headers["Authorization"] = "Token e9131afdaa36cb065382c3333c43e1844fa52a0e";
    config.headers["X-Secret"] = "b7e1a5b6ffe593faeb805dc50d9be92e178f26d8";

    console.log(config);

    this.apiRequest.post(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      { query: address },
      { ...config },
    );
  }

  createEvent() {
    const newEvent: Partial<AlarmEvent> = {};
    newEvent.id = Guid.newGuid();
    this.storage.uploadFile(`${this.DB_PATH}/${newEvent.id}`, this.classToBlob(newEvent));
    return newEvent;
  }

  async getEventById(id: string) {
    try {
      const url = await this.storage.getDownloadUrl(`${this.DB_PATH}/${id}`);
      return (await this.apiRequest.get(url)).data.data;
    } catch {
      return null;
    }
  }

  updateEvent(event: AlarmEvent) {
    this.storage.uploadFile(`${this.DB_PATH}/${event.id}`, this.classToBlob(event));
    return event;
  }

  deleteEvent(eventId: string) {
    this.storage.deleteFile(`${this.DB_PATH}/${eventId}`);
  }

  addMember(event: AlarmEvent, user: AppUser) {
    const index = event.members.findIndex((iter) => iter.user?.id === user.id);
    if (index < 0) {
      const eventMember: EventMember = { event, user, isMain: false };
      event.members.push(eventMember);
    }
  }

  setMemberStatus(event: AlarmEvent, user: AppUser, status: EventMemberStatus) {
    const member = this.getMemberByUser(event, user);
    if (!!member) {
      member.willStatus = status;
    }
  }

  removeMember(event: AlarmEvent, user: AppUser) {
    const index = event.members.findIndex((iter) => iter.user?.id === user.id);
    if (index > -1) {
      event.members.splice(index, 1);
    }
  }

  getMemberByUser(event: AlarmEvent, user: AppUser) {
    const index = event.members.findIndex((iter) => iter.user?.id === user.id);
    return index > -1 ? event.members[index] : null;
  }

  addMemberGeoPosition(member: EventMember, position: EventGeoPosition) {
    if (!member.geoTrack) {
      member.geoTrack = [];
    }
    member.geoTrack.push(position);
  }
  private classToBlob(obj: any) {
    return new Blob([JSON.stringify(obj)], { type: "application/json" });
  }
}
