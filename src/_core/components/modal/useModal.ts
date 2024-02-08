import { Component, ComponentInternalInstance, getCurrentInstance, inject, ref, Ref, SetupContext, watch } from "vue";
import { renderComponent } from "@/_core/utils/ComponentUtils";

export default function useModal() {
  const appInst = getCurrentInstance()?.appContext;

  const show = async <T>(component: Component, props?: any): Promise<T> => {
    const modalProps = { ...props, show: true };
    return new Promise((resolve) => {
      const compProps = { ...modalProps, resolve };
      renderComponent(appInst, component, { props: compProps });
    });
  };

  return {
    show,
  };
}
