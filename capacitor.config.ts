import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appName: "Рыжков",
  appId: "ryzhkov.customer.app",
  webDir: "dist",
  server: {
    iosScheme: "ionic",
    androidScheme: "http",
  },

  android: {
    minWebViewVersion: 55,
    minHuaweiWebViewVersion: 8,
  },

  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },

    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
    },
  },
  ios: {
    cordovaLinkerFlags: ["-ObjC"],
  },
};

export default config;
