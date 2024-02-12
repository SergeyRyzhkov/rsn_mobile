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
import { SplashScreen } from "@capacitor/splash-screen";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { ServiceLocator } from "./_core/service/ServiceLocator";

const axios = createAxiosInstance(false);
ServiceLocator.instance.updateAxios(axios);

const app = createApp(App);

dayjs.locale("ru");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

app.directive("lazysrc", lazySrcDirective);

app.use(createPinia());
app.use(VueTelInput);

const router = createAppRouter();
app.use(router);

app.mount("#app");

SplashScreen.hide();
