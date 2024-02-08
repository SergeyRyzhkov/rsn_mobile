import "vue-router";
import "vue";

declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}
