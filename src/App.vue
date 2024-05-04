<script setup lang="ts">
  import Scarecrow from "./components/Scarecrow.vue";
</script>

<template>
  <div class="container rainbow-border">
    <Suspense>
      <Scarecrow></Scarecrow>
    </Suspense>
  </div>
</template>

<style scoped>
  .container {
    padding: var(--lengths-sm-4);
    border-radius: var(--lengths-sm-4);
    filter: var(--common-shadow);
    background-color: var(--monochrome-1);
  }
</style>
