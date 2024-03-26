import { RecordRTCPromisesHandler } from "recordrtc";

export interface RecordingData {
  blob: Blob;
  base64String: string;
  size: number;
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
  startPause: 500,
  isFrontCamera: true,
  recordAudio: true,
  recordVideo: true,
  mimeType: "video/webm;codecs=vp9,opus",
};

export const useMediaRecorder = (options?: RecordingOptions) => {
  const opt = { ...defaultRecordingOptions, ...options };

  let recorder: RecordRTCPromisesHandler | null;

  const startRecording = async () => {
    if (!!opt.recordVideo || !!opt.recordAudio) {
      let recordingSize = 0;
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
        timeSlice: 1000, // pass this parameter
        disableLogs: true,
        checkForInactiveTracks: true,
        // bitsPerSecond: 10000000,
        //@ts-ignore
        mimeType: opt.mimeType || "video/webm;codecs=vp9,opus",
        ondataavailable: (blob) => {
          recordingSize += blob.size;
          if (!!opt.onChunkCallback) {
            opt.onChunkCallback(blob);
          }
          if (!!opt.maxSize && recordingSize >= opt.maxSize) {
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
      await sleep(opt.startPause || 500);

      await recorder.startRecording();
    }
  };

  const stopRecording = async (): Promise<RecordingData | null> => {
    if (!!recorder) {
      await recorder.stopRecording();
      const blob = await recorder.getBlob();
      const base64String = await recorder.getDataURL();
      const mimeType = blob.type;
      const size = blob.size;

      //@ts-ignore
      const tracks = recorder.stream.getTracks() as MediaStreamTrack[];
      if (!!tracks) {
        tracks.forEach((iter) => iter.stop());
      }

      await recorder.reset();
      await recorder.destroy();
      recorder = null;

      const result = {
        blob,
        base64String,
        url: (window.webkitURL || window.URL).createObjectURL(blob),
        mimeType: opt.mimeType || "video/webm;codecs=vp9,opus",
        size,
      };

      if (!!opt.onDataCallback) {
        opt.onDataCallback(result);
      }

      return result;
    }
    return null;
  };

  const currentStatus = async () => {
    return !!recorder ? await recorder?.getState() : "destroyed";
  };

  return {
    startRecording,
    stopRecording,
    currentStatus,
  };
};
