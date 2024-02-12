import { nextTick, ref } from "vue";

export const useSpeechRec = () => {
  let recognition: any;
  let recognitionIndex: number;

  const result = ref("");

  const init = () => {
    //@ts-ignore
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "ru";

    recognitionIndex = -1;
    result.value = "";
  };

  const start = () => {
    init();
    recognition.start();

    alert(recognition);

    recognition.onresult = (event) => {
      const results = event.results; //   получаем список результатов
      recognitionIndex++;
      const firstResult = results[recognitionIndex]; // получаем распознанный результат

      if (!!firstResult && !!firstResult.length) {
        const firstAlternative = firstResult[0]; // получаем первый вариант распознавания
        const transcript = !!firstAlternative ? firstAlternative.transcript : ""; //  распознанный текст
        result.value = result.value + transcript;
      }
    };
  };

  const stop = () => {
    if (!!recognition) {
      setTimeout(() => recognition.stop(), 1300);
    }
  };

  return {
    start,
    stop,
    result,
  };
};
