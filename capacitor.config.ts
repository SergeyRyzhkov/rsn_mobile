import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appName: "Шмель",
  appId: "ryzhkov.ro.app",
  webDir: "dist",
  server: {
    iosScheme: "ionic",
    androidScheme: "http",
  },

  // android: {
  //   minWebViewVersion: 55,
  //   minHuaweiWebViewVersion: 8,
  // },

  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },

    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      backgroundColor: "#ffffffff",
      splashFullScreen: true,
      useDialog: false,
    },
  },
  // ios: {
  //   cordovaLinkerFlags: ["-ObjC"],
  // },
};

export default config;
