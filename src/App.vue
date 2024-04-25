<script setup lang="ts">
  import Scarecrow from "./components/Scarecrow.vue";
</script>

<template>
  <Suspense>
    <Scarecrow></Scarecrow>
  </Suspense>
</template>

<style scoped>
  video {
    width: 100px;
    height: 100px;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
