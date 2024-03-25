import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appName: "Шмель",
  appId: "ryzhkov.ro.app",
  webDir: "dist",
  // server: {
  // iosScheme: "ionic",
  // androidScheme: "http",
  // iosScheme: "https",
  // androidScheme: "https",
  // },

  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },

    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      backgroundColor: "#ffffffff",
      splashFullScreen: false,
      useDialog: false,
      splashImmersive: true,
    },
  },
};

// if (!!config.server) {
//   config.server.url = "http://192.168.0.103:8100";
//   config.server.cleartext = true;
// }

export default config;
