export const metrikaGoal = (value: string, data?: any) => {
  try {
    // @ts-ignore
    if (!window.yaCounters[`${window.yandexMetrikaCounter}`]) {
      console.error("Yandex.Metrika not initialized.");
      return;
    }

    // @ts-ignore
    const id = window.yandexMetrikaCounter;
    console.info("Yandex.Metrika was founded.", "We use the counter number:", id);

    window.yaCounters[id].reachGoal(value, data);

    console.log("metrikaGoal good");
  } catch (e) {
    console.error("Yandex.Metrika error:", e);
  }
};
