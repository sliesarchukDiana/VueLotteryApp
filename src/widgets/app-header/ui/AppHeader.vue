<script setup lang="ts">
import { useThemeStore } from '@/entities/theme'
import Logo from "./Logo.vue";
import AppNavigation from "./AppNavigation.vue";
const themeStore = useThemeStore()
</script>

<template>
  <nav class="nav-links">
    <Logo />
    <AppNavigation />
    <button @click="themeStore.toggleTheme" class="theme-btn">
      {{ themeStore.isDark ? '☀️' : '🌙' }}
    </button>
  </nav>
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