import { createRouter, createWebHistory, Router } from "vue-router";

let router: Router;

const createAppRouter = () => {
  router = createRouter({
    history: createWebHistory(),

    scrollBehavior(_to, _from, savedPosition) {
      if (!!savedPosition) {
        return savedPosition;
      } else {
        return { top: 0, behavior: "smooth" };
      }
    },

    routes: [
      {
        name: "home-page",
        path: "/",
        component: () => import("@/modules/main/pages/StartPage.vue"),
      },

      {
        name: "timers-list",
        path: "/timers-list",
        component: () => import("@/modules/timers/pages/TimersList.vue"),
      },

      {
        name: "meteo-list",
        path: "/meteo-list",
        component: () => import("@/modules/meteo/pages/MeteoList.vue"),
      },

      {
        name: "not-found",
        path: "/:catchAll(.*)",
        component: () => import("@/_core/components/NotFound.vue"),
      },
    ],
  });

  return router;
};

export const gotoBack = () => {
  router.back();
};

export { createAppRouter };
export { router };
