import { Geolocation, Position } from "@capacitor/geolocation";
import { onUnmounted, ref } from "vue";
import { Capacitor } from "@capacitor/core";
import { NativeSettings, AndroidSettings, IOSSettings } from "capacitor-native-settings";
import useModal from "@/_core/components/modal/useModal";
import ConfirmModal from "@/_core/components/modal/ConfirmModal.vue";

const modal = useModal();

export interface GeoPosition {
  timestamp?: number;
  coords: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number | null | undefined;
    altitude?: number | null;
    speed?: number | null;
    heading?: number | null;
  };
  valid?: boolean;
}

const checkPermissions = async (isFineLocation: boolean) => {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await Geolocation.checkPermissions();
      if (!!isFineLocation) {
        if (perm.location !== "granted") {
          const reqPromt = await Geolocation.requestPermissions({ permissions: ["location"] });
          return reqPromt.location === "granted";
        }
        return true;
      }

      if (!isFineLocation) {
        if (perm.coarseLocation !== "granted") {
          const reqPromt = await Geolocation.requestPermissions({ permissions: ["coarseLocation"] });
          return reqPromt.coarseLocation === "granted";
        }
        return true;
      }
    } catch {
      return false;
    }
  } else {
    return true;
  }
};

const showOpenLocationSettingsDialog = async () => {
  const res = await modal.show(ConfirmModal, {
    okButtonTitle: "Да",
    cancelButtonTitle: "Нет",
    title: "Открыть настройки местоположения",
    message:
      "Включите позиционирование по GPS, WiFi и мобильным сетям в системных настройках, чтобы увидеть ваше местоположение на карте",
  });

  if (!!res) {
    NativeSettings.open({
      optionAndroid: AndroidSettings.Location,
      optionIOS: IOSSettings.LocationServices,
    });
  }
};

export const useGeolocation = (
  options: PositionOptions = { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
  autoStart = false,
  showGPSSettingDialogOnFail = false,
  stopWatchOnDestroy = true,
) => {
  const currentPostion = ref<GeoPosition>({ coords: {} });
  let timerId;

  const updateGeoPosition = async () => {
    const checkResult = await checkPermissions(options.enableHighAccuracy || true);
    if (!!checkResult) {
      const position = await Geolocation.getCurrentPosition(options);
      if (!!position) {
        onPositionChanged(position);
        return position;
      }
    } else {
      stopWatchPosition();
      if (!!showGPSSettingDialogOnFail) {
        showOpenLocationSettingsDialog();
      }
    }
  };

  const startWatchPosition = async () => {
    stopWatchPosition();
    updateGeoPosition();
    timerId = setInterval(() => updateGeoPosition(), options.timeout);
  };

  const stopWatchPosition = () => {
    if (!!timerId) {
      clearInterval(timerId);
    }
  };

  const onPositionChanged = (position: Position | null, err?: any) => {
    if (!!err) {
      currentPostion.value.valid = false;
    }

    if (!!position && !err) {
      currentPostion.value.coords.latitude = position.coords.latitude;
      currentPostion.value.coords.longitude = position.coords.longitude;
      currentPostion.value.coords.accuracy = position.coords.accuracy;
      currentPostion.value.coords.speed = position.coords.speed;
      currentPostion.value.timestamp = position.timestamp;
      currentPostion.value.valid = true;
    }
  };

  if (!!autoStart) {
    updateGeoPosition();
    startWatchPosition();
  }

  onUnmounted(() => {
    if (!!stopWatchOnDestroy) {
      stopWatchPosition();
    }
  });

  return {
    checkPermissions,
    showOpenLocationSettingsDialog,
    currentPostion,
    startWatchPosition,
    stopWatchPosition,
    updateGeoPosition,
  };
};
