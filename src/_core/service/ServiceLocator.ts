import { AxiosInstance } from "axios";
import { BaseService } from "./BaseService";

type ConstructorOf<T extends BaseService> = new (...args: any[]) => T;

class ServiceRegistry {
  private servicesMap = new Map<ConstructorOf<BaseService>, any>();
  apiRequest: AxiosInstance;

  public updateAxios(axios: AxiosInstance) {
    this.apiRequest = axios;
    for (const iterServ of this.servicesMap.values()) {
      iterServ.apiRequest = this.apiRequest;
    }
  }

  public getService<T extends BaseService>(Ctor: ConstructorOf<T>): T {
    if (!this.servicesMap.has(Ctor)) {
      const service = new Ctor();
      service.apiRequest = this.apiRequest;
      this.servicesMap.set(Ctor, service);
    }
    return this.servicesMap.get(Ctor) || new BaseService();
  }
}

export class ServiceLocator {
  static _instance: ServiceRegistry = new ServiceRegistry();
  public static get instance() {
    return this._instance;
  }
}
