import { Geolocation, Position } from "@capacitor/geolocation";
import { onUnmounted, ref } from "vue";

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

const checkAppPermissions = async (isFineLocation: boolean) => {
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
      alert("isFineLocation" + reqPromt.coarseLocation);
      return reqPromt.coarseLocation === "granted";
    }
    return true;
  }
};

export const useGeolocation = (
  options: PositionOptions = { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
  autoStart = false,
  stopWatchOnDestroy = true,
) => {
  const currentPostion = ref<GeoPosition>({ coords: {} });

  let timerId;

  const updateGeoPosition = async () => {
    if (!!(await checkAppPermissions(options.enableHighAccuracy || true))) {
      const position = await Geolocation.getCurrentPosition(options);
      if (!!position) {
        onPositionChanged(position);
        return position;
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
    currentPostion,
    startWatchPosition,
    stopWatchPosition,
    updateGeoPosition,
  };
};
