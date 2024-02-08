<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 30 });
</script>

<template>
  <div class="loading-container">
    <div class="lds-ring" :style="{ width: `${size}px`, height: `${size}px` }">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/*! purgecss start ignore */
.loading-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.5);
}

.lds-ring {
  display: inline-block;
  position: relative;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: inherit;
  height: inherit;
  border: 3px solid;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $primary transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
