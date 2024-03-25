// import { Capacitor } from '@capacitor/core';
// import { AppUpdate } from '@capawesome/capacitor-app-update';

// const getCurrentAppVersion = async () => {
//   const result = await AppUpdate.getAppUpdateInfo();
//   if (Capacitor.getPlatform() === 'android') {
//     return result.currentVersionCode;
//   } else {
//     return result.currentVersionName;
//   }
// };

// const getAvailableAppVersion = async () => {
//   const result = await AppUpdate.getAppUpdateInfo();
//   if (Capacitor.getPlatform() === 'android') {
//     return result.availableVersionCode;
//   } else {
//     return result.availableVersionName;
//   }
// };

// const openAppStore = async () => {
//   await AppUpdate.openAppStore(); тут ru вроде
// };

// const performImmediateUpdate = async () => {
//   const result = await AppUpdate.getAppUpdateInfo();
//   if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
//     return;
//   }
//   if (result.immediateUpdateAllowed) {
//     await AppUpdate.performImmediateUpdate();
//   }
// };

// const startFlexibleUpdate = async () => {
//   const result = await AppUpdate.getAppUpdateInfo();
//   if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
//     return;
//   }
//   if (result.flexibleUpdateAllowed) {
//     await AppUpdate.startFlexibleUpdate();
//   }
// };

// const completeFlexibleUpdate = async () => {
//   await AppUpdate.completeFlexibleUpdate();
// };

// async addToNativeCalendar() {
//     const calendarData = {};
//     if (!!calendarData) {
//       try {
//         await Calendar
//           .createEventInteractivelyWithOptions
//           // calendarData?.title,
//           // calendarData?.address,
//           // calendarData?.description,
//           // new Date(calendarData?.startAt),
//           // new Date(calendarData?.endAt),
//           // {
//           //   firstReminderMinutes: 120,
//           //   secondReminderMinutes: 60,
//           // },
//           ();
//       } catch (exc: any) {
//         alert("Не удалось добавить запись в календарь");
//       }
//     }
//   }

//   async deleteOrderFromCalendar() {
//     const calendarData = {};
//     if (!!calendarData) {
//       try {
//         await Calendar
//           .deleteEvent
//           // calendarData?.title,
//           // calendarData?.address,
//           // calendarData?.description,
//           // new Date(calendarData?.startAt),
//           // new Date(calendarData?.endAt),
//           ();
//       } catch (exc: any) {
//         alert(exc);
//       }
//     }
//   }
