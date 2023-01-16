<script setup lang="ts">
import List from './components/List.vue'
import Radar from './components/Radar.vue';
</script>

<template>
  <h1>Birdnest Radar</h1>
  <div class="main">
    <Radar />
    <List />
  </div>
</template>

<style scoped>
.main {
  display: flex;
  gap: 2rem;
  place-items: center;
  justify-content: center;
}

@media screen and (max-width: 1280px) {
  .main {
    flex-direction: column;
  }
}
</style>
