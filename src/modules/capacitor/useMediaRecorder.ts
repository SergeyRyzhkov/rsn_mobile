import { RecordRTCPromisesHandler, bytesToSize } from "recordrtc";
import { computed, onUnmounted, ref } from "vue";

export interface RecordingData {
  blob: Blob;
  base64String: string;
  size: number;
  humanSize: string;
  mimeType: string;
  url: string;
}

export interface RecordingOptions {
  startPause?: number;
  videoWidth?: number;
  maxSize?: number;
  maxDuration?: number;
  isFrontCamera?: boolean;
  recordAudio?: boolean;
  recordVideo?: boolean;
  mimeType?: string;
  onChunkCallback?: (blob: Blob) => void;
  onDataCallback?: (result: RecordingData) => void;
}

const defaultRecordingOptions: RecordingOptions = {
  videoWidth: 720,
  maxSize: 0,
  startPause: 0,
  isFrontCamera: true,
  recordAudio: true,
  recordVideo: true,
  mimeType: "video/webm;codecs=vp9,opus",
};

export const useMediaRecorder = () => {
  const totalSize = ref(0);
  const humanTotalSize = computed(() => bytesToSize(totalSize.value));

  let recorder: RecordRTCPromisesHandler | null;
  let dataCallbak: ((result: RecordingData) => void) | null | undefined;

  const startRecording = async (options?: RecordingOptions) => {
    dataCallbak = options?.onDataCallback;
    await stopRecording();

    const opt = { ...defaultRecordingOptions, ...options };

    if (!!opt.recordVideo || !!opt.recordAudio) {
      totalSize.value = 0;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: !!opt.recordVideo
          ? {
              facingMode: opt.isFrontCamera ? "environment" : "user",
              width: opt.videoWidth,
            }
          : false,
        audio: opt.recordAudio,
      });

      recorder = new RecordRTCPromisesHandler(stream, {
        // type: "video",
        timeSlice: 500, // pass this parameter
        disableLogs: true,
        checkForInactiveTracks: true,
        // bitsPerSecond: 10000000,
        //@ts-ignore
        mimeType: opt.mimeType || "video/webm;codecs=vp9,opus",
        ondataavailable: (blob) => {
          totalSize.value += blob.size;
          if (!!opt.onChunkCallback) {
            opt.onChunkCallback(blob);
          }
          if (!!opt.maxSize && totalSize.value >= opt.maxSize) {
            stopRecording();
          }
        },
      });

      if (!!opt.maxDuration) {
        recorder.recordRTC.setRecordingDuration(opt.maxDuration).onRecordingStopped(stopRecording);
      }

      //@ts-ignore
      recorder.stream = stream;

      const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
      if (!!opt.startPause && opt.startPause > 0) {
        await sleep(opt.startPause || 500);
      }

      await recorder.startRecording();
      return stream;
    }
  };

  const stopRecording = async (): Promise<RecordingData | null> => {
    if (!!recorder) {
      await recorder.stopRecording();

      const blob = await recorder.getBlob();
      const base64String = await recorder.getDataURL();

      //@ts-ignore
      const tracks = recorder.stream?.getTracks() as MediaStreamTrack[];
      if (!!tracks) {
        tracks.forEach((iter) => iter.stop());
      }
      //@ts-ignore
      recorder.stream = null;

      await recorder.reset();
      await recorder.destroy();
      recorder = null;

      const result = {
        blob,
        base64String,
        url: (window.webkitURL || window.URL).createObjectURL(blob),
        mimeType: blob.type || "video/webm;codecs=vp9,opus",
        size: blob.size,
        humanSize: bytesToSize(blob.size),
      };

      if (!!dataCallbak) {
        dataCallbak(result);
      }
      return result;
    }
    return null;
  };

  onUnmounted(() => {
    stopRecording();
  });

  return {
    totalSize,
    humanTotalSize,
    startRecording,
    stopRecording,
  };
};
