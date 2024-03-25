<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import "video.js/dist/video-js.min.css";
import videojs from "video.js";

let player: any = null;
const reseted = ref(true);
const video = ref<HTMLVideoElement>();
const isVideoLoaded = ref(false);

const emit = defineEmits(["ready", "waiting", "canplaythrough", "loadeddata", "loadedmetadata"]);

const defaultVideoOptions = {
  autoplay: false,
  controls: true,
  inactivityTimeout: 0,
  preload: "metadata",
  fluid: true,
  techOrder: ["html5"],
  liveui: true,
  responsive: true,
  sources: [],
  playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3],
  muted: false,
  bigPlayButton: true,
};

const props = defineProps<{
  src?: { src: string; type?: string };
  crossOrigin?: string;
  options?: any;
  playsinline?: string;
}>();

watch(
  () => props.options,
  (options, _oldOptions) => {
    isVideoLoaded.value = false;
    dispose(() => {
      if (options?.sources?.length) {
        initialize();
      }
    });
  },
);

watch(
  () => props.src,
  () => {
    if (!!props.src) {
      setSrc(props.src);
    }
  },
);

onMounted(async () => {
  isVideoLoaded.value = false;
  await nextTick();
  initialize();
});

onBeforeUnmount(() => {
  if (!!player) {
    dispose(null);
  }
});

const dispose = (callback) => {
  if (player && player.dispose) {
    player.dispose();
    player = null;
    nextTick(() => {
      reseted.value = false;
      nextTick(() => {
        reseted.value = true;
        nextTick(() => {
          callback && callback();
        });
      });
    });
  }
};

const initialize = () => {
  if (!!video.value) {
    const videoOptions = { ...defaultVideoOptions, ...props.options };
    // ios fullscreen
    // if (video.value.playsInline) {
    video.value.setAttribute("playsinline", props.playsinline || "");
    video.value.setAttribute("webkit-playsinline", props.playsinline || "");
    video.value.setAttribute("x5-playsinline", props.playsinline || "");
    video.value.setAttribute("x5-video-player-type", "h5");
    video.value.setAttribute("x5-video-player-fullscreen", "false");
    // }
    // cross origin
    if (!!props.crossOrigin) {
      video.value.crossOrigin = props.crossOrigin;
      video.value.setAttribute("crossOrigin", props.crossOrigin);
    }
    if (videoOptions.plugins) {
      delete videoOptions.plugins.__ob__;
    }

    player = videojs(video.value, videoOptions, () => {
      emit("ready");
    });

    if (!!props.src) {
      setSrc(props.src);
    }

    player.on("waiting", function (event) {
      emit("waiting");
    });

    player.on("canplaythrough", function (event) {
      emit("canplaythrough");
      isVideoLoaded.value = true;
    });

    player.on("loadedmetadata", function (event) {
      emit("loadedmetadata");
    });

    player.on("loadeddata", function (event) {
      emit("loadeddata");
    });
  }
};

const setSrc = (source: { src: string; type?: string }) => {
  if (!!player && !!source) {
    const video: { src: string; type?: string } = {
      src: source.src,
    };

    if (!!source.type) {
      video.type = source.type;
    }
    player.pause();
    player.reset(); // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
    player.src(video);
    player.load();
  }
};

defineExpose({ video, player, setSrc });
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<template>
  <video v-if="reseted" ref="video" class="video-js vjs-default-skin" v-bind="$attrs" playsInline>
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
  </video>
</template>

<style lang="scss">
.video-js {
  width: 100%;
  // height: 4;
}

.vjs-control-bar {
  display: flex !important;
  visibility: visible;
  opacity: 1;

  // .vjs-playback-rate,
  .vjs-time-control {
    display: flex !important;
  }
}
</style>
