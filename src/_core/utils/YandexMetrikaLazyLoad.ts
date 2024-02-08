import { Router } from "vue-router";

declare global {
  interface Window {
    Ya: {
      Metrika2: any;
    };
    yaCounters: any;
    yandexMetrikaCounter: any;
  }
}

const yaMetrikaExtScriptUrl = "https://mc.yandex.ru/metrika/tag.js";

const config: {
  id?: number;
  router?: Router;
  onError?: (exc) => void;
} = {};

export const addYndexMetrika = (id: number, router?: Router, onError?: (exc) => void) => {
  Object.assign(config, { id, router, onError });

  if (navigator.userAgent.indexOf("YandexMetrika") > -1) {
    lazyLoadScript();
  }
  initListeners();
  setTimeout(lazyLoadScript, 3000);
};

const initListeners = () => {
  window.addEventListener("scroll", lazyLoadScript, { passive: true });
  window.addEventListener("touchstart", lazyLoadScript);
  document.addEventListener("mouseenter", lazyLoadScript);
  document.addEventListener("click", lazyLoadScript);
};

const uninstallListeners = () => {
  window.removeEventListener("scroll", lazyLoadScript);
  window.removeEventListener("touchstart", lazyLoadScript);
  document.removeEventListener("mouseenter", lazyLoadScript);
  document.removeEventListener("click", lazyLoadScript);
};

const lazyLoadScript = async () => {
  try {
    uninstallListeners();
    const isAdded = await loadScript();
    if (isAdded) {
      installMetrika();
    }
  } catch (err) {
    if (config.onError) {
      config.onError(err);
    }
  } finally {
    uninstallListeners();
  }
};

const installMetrika = async () => {
  const init = {
    id: config.id,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    triggerEvent: true,
  };

  const metrika = new window.Ya.Metrika2(init);

  if (!window.yaCounters) {
    window.yaCounters = {};
  }
  window.yaCounters[`${config.id}`] = metrika;

  window.yandexMetrikaCounter = config.id;

  document.addEventListener(`yacounter${config.id}inited`, (_event) => {
    config?.router?.afterEach((to, from) => {
      setTimeout(() => metrika.hit(to.path, { referer: from.path }), 0);
    });
  });
};

const loadScript = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(`script[src="${yaMetrikaExtScriptUrl}"]`);

    if (!el) {
      const screl = document.createElement("script");
      screl.type = "text/javascript";
      screl.async = true;
      screl.defer = true;
      screl.src = yaMetrikaExtScriptUrl;

      document.head.appendChild(screl);

      screl.addEventListener("error", reject);
      screl.addEventListener("abort", reject);
      screl.addEventListener("load", () => {
        screl.setAttribute("data-loaded", "true");
        resolve(true);
      });
    }

    if (!!el && el.hasAttribute("data-loaded")) {
      resolve(false);
    }
  });
};

export const sendGoal = (goalName: string) => {
  const goalAction = () => {
    try {
      window.yaCounters[`${config.id}`].reachGoal(goalName);
    } catch (err) {
      console.log(err);
    }
  };
  //callback to execute all items from internal array for events
  if (window.Ya) {
    goalAction();
  } else {
    document.addEventListener(`yacounter${config.id}inited`, goalAction);
  }
};
