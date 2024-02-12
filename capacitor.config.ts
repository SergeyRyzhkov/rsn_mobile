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
      showDuration: 2000,
      autoHide: true,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: false,
      backgroundColor: "#f5f9fc",
    },
  },
  ios: {
    cordovaLinkerFlags: ["-ObjC"],
  },
};

export default config;
