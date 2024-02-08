import { ObjectDirective } from "vue";

const options = {
  root: null,
  rootMargin: "30px",
  threshold: 0.0,
};

let observer: IntersectionObserver;

export const animateDirective: ObjectDirective = {
  created(el, binding) {
    if (!observer) {
      observer = new IntersectionObserver((elements) => {
        elements.forEach((iter) => {
          if (iter.isIntersecting) {
            iter.target.classList.add("section-animate-transition");
          }
        });
      }, options);
    }
    observer.observe(el);
  },
};
