import { createComponent } from "@/_core/utils/ComponentUtils";
import ToastContainer from "@/_core/components/toast/ToastContainer.vue";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { Guid } from "@/_core/utils/Guid";

let toastContainerInstance: ComponentInternalInstance | null = null;

export default function useNotify() {
  const getOrCreateContainer = () => {
    if (!toastContainerInstance) {
      const appInst = getCurrentInstance()?.appContext;
      const res = createComponent(appInst, ToastContainer, {});
      toastContainerInstance = res;
    }
    return toastContainerInstance;
  };

  // getOrCreateContainer();

  const show = (warning: boolean, text: string) => {
    const container = getOrCreateContainer();
    if (!!container) {
      container.exposed?.addNotify({ warning, text, id: Guid.newGuid() });
    }
  };

  const warning = (text: string) => {
    show(true, text);
  };

  const message = (text: string) => {
    show(false, text);
  };

  return {
    warning,
    message,
  };
}
