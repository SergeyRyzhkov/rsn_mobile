import { Geolocation, Position } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { ref } from "vue";

export type GeoPosition = {
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitudeAccuracy: number | null | undefined;
    altitude: number | null;
    speed: number | null;
    heading: number | null;
  };
  valid?: boolean;
};

const checkAppPermissions = async () => {
  const perm = await Geolocation.checkPermissions();
  if (perm.location !== "granted" || perm.coarseLocation !== "granted") {
    const reqPromt = await Geolocation.requestPermissions();
    if (reqPromt.location !== "granted" || perm.coarseLocation !== "granted") {
      return false;
    }
  }
  return true;
};

export const useGeolocation = (
  options: PositionOptions = { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
  autoStart = true,
) => {
  const currentPostion = ref<Partial<GeoPosition>>({});

  let timerId;

  const updateGeoPosition = async () => {
    if (!!(await checkAppPermissions())) {
      const res = await Geolocation.getCurrentPosition(options);
      onPositionChanged(res);
    }
  };

  const startWatchPosition = async () => {
    timerId = setInterval(() => updateGeoPosition(), options.timeout);
  };

  const stopWatchPosition = () => {
    clearInterval(timerId);
  };

  const onPositionChanged = (position: Position | null, err?: any) => {
    if (!!currentPostion.value) {
      currentPostion.value.valid = false;
    }

    if (!!currentPostion.value && !!err) {
      currentPostion.value.valid = false;
    }

    if (!!position) {
      currentPostion.value.coords = position.coords;
      currentPostion.value.timestamp = position.timestamp;
      currentPostion.value.valid = true;
    }
  };

  if (!!autoStart) {
    updateGeoPosition();
    startWatchPosition();
  }

  return {
    currentPostion,
    startWatchPosition,
    stopWatchPosition,
    updateGeoPosition,
  };
};
