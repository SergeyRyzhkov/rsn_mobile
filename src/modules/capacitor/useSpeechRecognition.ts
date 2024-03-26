import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { onUnmounted, ref } from "vue";

export interface SpeechRecognitionOptions {
  language?: string;
  maxResults?: number;
  popup?: boolean;
  listenerFunc?: (status: "started" | "stopped") => void;
}

const defaulSpeechRecognitionOptions: SpeechRecognitionOptions = {
  language: "ru-RU",
  maxResults: 2,
  popup: false,
};

const hasPermissions = async () => {
  try {
    if (!(await SpeechRecognition.available())) {
      return false;
    }

    const permStatus = await SpeechRecognition.checkPermissions();
    if (permStatus.speechRecognition === "granted") {
      return true;
    }

    if ((await SpeechRecognition.requestPermissions()).speechRecognition === "granted") {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const useSpeechRecognition = (options?: SpeechRecognitionOptions) => {
  const opt = { ...defaulSpeechRecognitionOptions, ...options, ...{ partialResults: true } };

  const listeningState = ref<"stopped" | "started">("stopped");

  const start = async (onPartialResults?: (matches: string[]) => void) => {
    if (await hasPermissions()) {
      await SpeechRecognition.start(opt);

      SpeechRecognition.addListener("partialResults", (data: { matches: string[] }) => {
        if (!!onPartialResults) {
          onPartialResults(data.matches);
        }
      });

      //@ts-ignore
      SpeechRecognition.addListener("listeningState", (data: { status: "started" | "stopped" }) => {
        listeningState.value = data.status;
        if (!!opt.listenerFunc) {
          opt.listenerFunc(data.status);
        }
      });
    }
  };

  const stop = async () => {
    listeningState.value = "stopped";
    SpeechRecognition.removeAllListeners();
  };

  onUnmounted(() => {
    stop();
  });

  return {
    hasPermissions,
    start,
    stop,
    listeningState,
  };
};
