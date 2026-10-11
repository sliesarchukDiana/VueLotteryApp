<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
</script>

<template>
  <header class="app-header">
    <Logo />
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
</style>