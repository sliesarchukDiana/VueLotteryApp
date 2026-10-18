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