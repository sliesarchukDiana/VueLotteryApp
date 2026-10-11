<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="logo">Vue Lottery App</div>
    <AppNavigation />
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #e1e4e8;
  margin-bottom: 2rem;
}
.logo {
  font-weight: 700;
  font-size: 1.2rem;
}
</style>