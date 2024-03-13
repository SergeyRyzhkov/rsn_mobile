<script setup lang="ts">
import { computed, onUnmounted, ref, watchPostEffect } from "vue";

import { usePointerSwipe } from "@vueuse/core";
import { UseSwipeDirection } from "@vueuse/core";
import { useScrollSizeObserver } from "vue-use-scroll-size-observer";

const enum SwipeDirection {
  DOWN = "down",
  UP = "up",
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
}

const props = withDefaults(
  defineProps<{
    clickToClose?: boolean;
    swipeable?: boolean;
    overlayColor?: string;
    maxHeight?: string;
    maxWidth?: string;
    heightDeltaPercentToAutoClose?: number;
    contentScrollable?: boolean;
    noScrollbar?: boolean;
    autoRecalcHeight?: boolean;
    showCloseButton?: boolean;
    show?: boolean;
  }>(),
  {
    clickToClose: true,
    swipeable: true,
    overlayColor: "#0000004D",
    contentScrollable: true,
    noScrollbar: true,
    maxHeight: "96vh",
    maxWidth: "640px",
    heightDeltaPercentToAutoClose: 40,
    autoRecalcHeight: true,
    showCloseButton: false,
    show: false,
  },
);

const emits = defineEmits(["opened", "closed"]);

const barHeight = 38;

const bottomSheetCardRef = ref<HTMLDivElement>();
const bottomSheetCardContentRef = ref<HTMLDivElement>();
const bottomSheetCardPanRef = ref<HTMLDivElement>();

const initCardHeight = ref<number>(0);
const currentCardHeight = ref<number>(0);

const opened = ref(false);

const cardMaxHeightCss = computed(() => {
  return props.maxHeight;
});

const cardMaxWidthCss = computed(() => {
  return props.maxWidth;
});

const cardHeightCss = computed(() => {
  return !!currentCardHeight.value
    ? `calc(${currentCardHeight.value}px + env(safe-area-inset-bottom))`
    : `calc(${bottomSheetCardRef.value?.scrollHeight}px + env(safe-area-inset-bottom))`;
});

const contentHeightCss = computed(() => {
  return `calc(100% - ${barHeight}px + env(safe-area-inset-bottom))`;
});

const contentOverflowCss = computed(() => {
  return !!props.contentScrollable ? "auto" : "none";
});

const bottomOnСloseCss = computed(() => {
  return `calc(-${bottomSheetCardRef.value?.scrollHeight}px)`;
});

const swipeProgress = ref(false);

if (!!props.swipeable) {
  const { distanceY, direction } = usePointerSwipe(bottomSheetCardPanRef, {
    threshold: 1,
    disableTextSelect: true,

    onSwipe(_e: PointerEvent) {
      swipeProgress.value = true;
      if (
        direction.value === SwipeDirection.DOWN ||
        (direction.value === SwipeDirection.UP && currentCardHeight.value < initCardHeight.value)
      ) {
        currentCardHeight.value = initCardHeight.value + distanceY.value;
      }
    },

    onSwipeEnd(_e: PointerEvent, direction: UseSwipeDirection) {
      swipeProgress.value = false;
      if (direction === SwipeDirection.DOWN || direction === SwipeDirection.UP) {
        if ((100 * currentCardHeight.value) / initCardHeight.value < 100 - props.heightDeltaPercentToAutoClose) {
          close();
        } else {
          currentCardHeight.value = initCardHeight.value;
        }
      }
    },
  });
}

const clickOnOverlayHandler = () => {
  if (props.clickToClose) {
    close();
  }
};

if (!!props.autoRecalcHeight) {
  const { previousScrollHeight, scrollHeight } = useScrollSizeObserver(bottomSheetCardContentRef);
  watchPostEffect(() => {
    if (
      !swipeProgress.value &&
      !!props.autoRecalcHeight &&
      previousScrollHeight.value &&
      !!scrollHeight.value &&
      !!opened.value &&
      previousScrollHeight.value !== scrollHeight.value
    ) {
      recalcHeight();
    }
  });
}

const open = () => {
  setDocumentOverflow(false);
  opened.value = true;
  recalcHeight();
  emits("opened");
};

const close = () => {
  setDocumentOverflow(true);
  opened.value = false;
  emits("closed");
};

const setDocumentOverflow = (enable: boolean) => {
  document.documentElement.style.overflowY = `${!enable ? "hidden" : "auto"}`;
  document.documentElement.style["touch-action"] = `${!enable ? "none" : "auto"}`;
  document.documentElement.style.overscrollBehavior = `${!enable ? "none" : ""}`;
};

const recalcHeight = () => {
  //@ts-ignore
  initCardHeight.value = bottomSheetCardContentRef.value?.firstChild?.nextSibling?.scrollHeight
    ? //@ts-ignore
      bottomSheetCardContentRef.value?.firstChild?.nextSibling?.scrollHeight + barHeight
    : initCardHeight.value;
  currentCardHeight.value = initCardHeight.value;
};

onUnmounted(() => {
  setDocumentOverflow(true);
});

defineExpose({ open, close, recalcHeight });
</script>

<template>
  <Teleport to="body">
    <div class="rsn-bottom-sheet" :class="[{ opened: !!opened, closed: !opened }]">
      <div class="rsn-bottom-sheet__overlay" @click="clickOnOverlayHandler"></div>
      <div ref="bottomSheetCardRef" class="rsn-bottom-sheet-card">
        <div ref="bottomSheetCardPanRef" class="rsn-bottom-sheet-card__draggable-area">
          <div class="rsn-bottom-sheet-card__draggable-thumb"></div>
          <button v-if="!!showCloseButton" class="rsn-bottom-sheet-card__close-btn" @click="close"></button>
        </div>
        <div ref="bottomSheetCardContentRef" class="rsn-bottom-sheet-card__content" :class="{ 'no-scrollbar': noScrollbar }">
          <slot :close="close"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.rsn-bottom-sheet {
  > * {
    box-sizing: border-box;
  }

  z-index: 9999;
  transition: all 0.3s ease;
  position: relative;

  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  &__overlay {
    position: fixed;
    inset: 0px;
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    user-select: none;
    background: v-bind(overlayColor);
  }

  .rsn-bottom-sheet-card {
    position: fixed;
    bottom: 0px;
    max-width: v-bind(cardMaxWidthCss);
    width: 100%;
    max-height: v-bind(cardMaxHeightCss);
    height: v-bind(cardHeightCss);
    background: white;
    border-radius: 18px 18px 0 0;
    z-index: 999999;
    margin: 0 auto;
    transition: bottom 0.3s ease;
    pointer-events: all;

    transform: translateX(-50%);
    left: 50%;

    &__draggable-area {
      padding: 16px;
      margin-bottom: 8px;
      cursor: grab;
    }

    &__draggable-thumb {
      width: 40px;
      height: 4px;
      background: #828284;
      border-radius: 8px;
      margin: 0 auto;
      pointer-events: none;
    }

    &__close-btn {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 6px;
      right: 6px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: #ededed;

      &::after {
        content: "\00d7";
        color: #828284;
        font-size: 26px;
      }
    }

    &__content {
      height: v-bind(contentHeightCss);
      margin-bottom: calc(env(safe-area-inset-bottom));
      overflow-y: v-bind(contentOverflowCss);
    }
  }

  &.opened {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .rsn-bottom-sheet__overlay {
      animation: show 0.3s ease;
      opacity: 1;
      visibility: visible;
    }
  }

  &.closed {
    opacity: 0;
    visibility: hidden;

    .rsn-bottom-sheet-card {
      bottom: v-bind(bottomOnСloseCss);
    }

    .rsn-bottom-sheet__overlay {
      animation: hide 0.2s ease;
    }
  }

  @keyframes show {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes hide {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>
