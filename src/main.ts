import { createAxiosInstance } from "./axiosBuilder";
import "@/assets/styles/index.scss";
import App from "@/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { lazySrcDirective } from "@/_core/utils/LazyLoad";
import { createAppRouter } from "./routerBuilder";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import VueTelInput from "vue-tel-input";
// import "vue-tel-input/vue-tel-input.css";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import eruda from "eruda";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Badge } from "@capawesome/capacitor-badge";

const bgStatus = async () => {
  try {
    await StatusBar.setBackgroundColor({ color: "#283593" });
  } catch {
    console.log("StatusBar err");
  }
};
bgStatus();

const axios = createAxiosInstance(false);
ServiceLocator.instance.updateAxios(axios);

const app = createApp(App);

dayjs.locale("ru");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

app.directive("lazysrc", lazySrcDirective);

app.use(createPinia());
// app.use(VueTelInput);

const router = createAppRouter();
app.use(router);

app.mount("#app");

Badge.set({ count: 10 });

eruda.init({
  tool: ["console", "elements", "network", "resource", "sources"],
});

// try {
//   AppMetrica.activate({
//     apiKey: "e5e4707e-fb3b-408b-bd01-f3ffa05b61a0",
//     logs: true,
//   });
// } catch (err) {
//   console.log(err);
// }

// SplashScreen.hide();
