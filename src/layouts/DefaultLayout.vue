<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>