<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<template>
  <nav class="nav-links">
    <RouterLink to="/" active-class="active-link">Home</RouterLink>
    <RouterLink to="/about" active-class="active-link">About author</RouterLink>
    <RouterLink v-if="isAuthenticated" to="/users" active-class="active-link">Users</RouterLink>
    <RouterLink v-if="!isAuthenticated" to="/login" active-class="active-link">Login</RouterLink>
    <a v-else href="#" @click.prevent="authStore.logout" class="logout-btn">Logout</a>
  </nav>
</template>

<style scoped>
.nav-links {
  display: flex;
  gap: 1rem;
}
.active-link {
  font-weight: bold;
  color: #c85e06;
}
.logout-btn {
  cursor: pointer;
}
</style>