<script setup lang="ts"></script>

<template>
  <div class="flex flex-col grow">
    <slot name="header"> </slot>
    <main class="page-wrapper">
      <slot name="content"> </slot>
    </main>
  </div>
</template>
