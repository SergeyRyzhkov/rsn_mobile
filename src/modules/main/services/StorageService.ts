import { Preferences } from "@capacitor/preferences";

export class StorageService {
  static setItem(key: string, value: string) {
    Preferences.set({
      key,
      value,
    });
    window.localStorage.setItem(key, value);
  }

  static async getItem(key: string) {
    const val = (await Preferences.get({ key })).value;
    if (!!val) {
      return val;
    } else {
      return window.localStorage.getItem(key);
    }
  }

  static removeItem(key: string) {
    Preferences.remove({ key });
    window.localStorage.removeItem(key);
  }
}
