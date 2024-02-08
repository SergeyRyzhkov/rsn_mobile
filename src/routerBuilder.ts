import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import AuthService from "./modules/auth/AuthService";

let router: Router;

const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (to.meta?.requiresAuth && !ServiceLocator.instance.getService(AuthService).isAuthenticated && to.name !== "home-page") {
    return {
      name: "login",
    };
  }
};

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
        name: "login",
        path: "/login",
        component: () => import("@/modules/auth/pages/AuthPage.vue"),
      },

      {
        name: "home-page",
        path: "/",
        component: () => import("@/modules/main/pages/StartPage.vue"),
      },

      {
        name: "select-booking-params",
        path: "/booking/params",
        // meta: { requiresAuth: true },
        component: () => import("@/modules/booking/pages/SelectBookingParamsPage.vue"),
      },

      {
        name: "doctor-booking",
        path: "/booking/doctors",
        component: () => import("@/modules/booking/pages/DoctorList.vue"),
      },

      {
        name: "doctor-order",
        path: "/order/doctors",
        props: true,
        component: () => import("@/modules/booking/pages/DoctorOrder.vue"),
      },

      {
        name: "doctor-order-complete",
        path: "/order/doctors",
        component: () => import("@/modules/booking/pages/OrderComplete.vue"),
      },

      {
        name: "doctor-detail",
        path: "/doctors/:slug",
        props: true,
        component: () => import("@/modules/booking/pages/DoctorDetail.vue"),
        children: [
          {
            name: "doctor-detail-about",
            path: "about",
            props: true,
            component: () => import("@/modules/booking/components/DoctorDetailAbout.vue"),
          },
          {
            name: "doctor-detail-shedules",
            path: "shedules",
            props: true,
            component: () => import("@/modules/booking/components/DoctorShedules.vue"),
          },
          {
            name: "doctor-detail-reviews",
            path: "reviews",
            props: true,
            component: () => import("@/modules/booking/components/DoctorReviews.vue"),
          },
        ],

        redirect: {
          name: "doctor-detail-shedules",
        },
      },

      {
        name: "profile",
        path: "/profile",
        // meta: { requiresAuth: true },
        component: () => import("@/modules/profile/pages/ProfilePage.vue"),
      },

      {
        name: "profile-detail",
        path: "/profile/detail",
        meta: { requiresAuth: true },
        component: () => import("@/modules/profile/pages/UserDetail.vue"),
      },

      {
        name: "profile-favor-doctors",
        path: "/profile/favor-doctors",
        component: () => import("@/modules/profile/components/FavoritesDoctors.vue"),
      },

      {
        name: "profile-contacts",
        path: "/profile/contacts",
        // meta: { requiresAuth: true },
        component: () => import("@/modules/profile/pages/ContactsPage.vue"),
      },
    ],
  });

  router.beforeEach((from, to) => authGuard(from, to));
  return router;
};

export const gotoBack = () => {
  router.back();
};

export { createAppRouter };
export { router };
