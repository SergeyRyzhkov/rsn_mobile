import { ObjectDirective } from "vue";

const loadClassesName = ["loading-image"];

const options = {
  root: null,
  rootMargin: "30px",
  threshold: 0.0,
};
let observer: IntersectionObserver;

const createObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver((images, observer) => {
      images.forEach((iter) => {
        if (iter.isIntersecting) {
          const lazyImg = iter.target;
          if (!!lazyImg) {
            const datasrc = lazyImg.getAttribute("data-src");
            if (!!datasrc && datasrc !== "null" && datasrc !== "undefined") {
              lazyImg.setAttribute("src", datasrc || "");
            }

            //@ts-ignore
            lazyImg.onload = () => {
              lazyImg.classList.remove(...loadClassesName);
              lazyImg.setAttribute("data-loaded", "true");
              lazyImg.removeAttribute("data-src");
            };

            const onError = () => {
              lazyImg.setAttribute("src", "/images/img-error.png.webp");
              lazyImg.classList.remove(...loadClassesName);
              lazyImg.setAttribute("data-loaded", "false");
              lazyImg.removeAttribute("data-src");
              lazyImg.removeEventListener("error", onError);
            };

            // lazyImg.addEventListener('load', onLoaded)
            // lazyImg.addEventListener("loadeddata", onLoaded);
            lazyImg.addEventListener("error", onError);
          }
          observer.unobserve(lazyImg);
        }
      });
    }, options);
  }
};

export const lazySrcDirective: ObjectDirective = {
  created(el, binding) {
    if (el.setAttribute) {
      el.setAttribute("decoding", "async");
      // if (!el.getAttribute('alt')) {
      el.setAttribute("alt", "");
      // }
      if (!el.getAttribute("data-src")) {
        el.setAttribute("data-src", binding.value);
      }
      // el.setAttribute('src', '/images/img-error.png.webp')
    }
    createObserver();
    observer.observe(el);
    if (!!el.classList.add) {
      el.classList.add(...loadClassesName);
    }
    // }
  },

  updated(el, binding) {
    if (!import.meta.env.SSR) {
      if (binding.oldValue !== binding.value) {
        el.setAttribute("data-src", binding.value);
        el.setAttribute("src", binding.value);
      }
    }
  },
};
