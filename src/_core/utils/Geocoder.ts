export const geolocationCoordinates = (): Promise<[number, number] | null> => {
  if (!!navigator.geolocation) {
    return new Promise((resolve, _reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve([coords.latitude, coords.longitude]);
        },
        (err) => {
          resolve(null);
        },
        {
          maximumAge: 60 * 60 * 1000,
          timeout: 10000,
          enableHighAccuracy: false,
        },
      );
    });
  }
  return Promise.resolve(null);
};
