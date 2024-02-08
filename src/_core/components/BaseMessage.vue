<script setup lang="ts"></script>

<template>
  <div class="base_card_message">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.base_card_message {
  border-left: 4px solid #f87e0d;
  border-radius: 5px;
  background: #fdfae0;
  padding: 12px;
}
</style>
