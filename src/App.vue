<script setup lang="ts">
  import Scarecrow from "./components/Scarecrow.vue";
</script>

<template>
  <Suspense>
    <div class="container rainbow-border">
      <Scarecrow></Scarecrow>
    </div>
  </Suspense>
</template>

<style scoped>
  .container {
    padding: var(--lengths-sm-4);
    border-radius: var(--lengths-sm-4);
    filter: var(--common-shadow);
    background-color: var(--monochrome-1);

  }
</style>
