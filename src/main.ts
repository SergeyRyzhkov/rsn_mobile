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
import { SplashScreen } from "@capacitor/splash-screen";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { App as mobileApp } from "@capacitor/app";

const app = createApp(App);

dayjs.locale("ru");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

app.directive("lazysrc", lazySrcDirective);

app.use(createPinia());
app.use(VueTelInput);

const router = createAppRouter();
app.use(router);

try {
  app.mount("#app");
} catch (err) {
  mobileApp.exitApp();
}

SplashScreen.hide();
