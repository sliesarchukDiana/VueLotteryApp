<script setup lang="ts">
import { useAuthStore } from '@/entities/session'
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="nav-links">
    <RouterLink to="/" active-class="active-link">Home</RouterLink>
    <RouterLink to="/about" active-class="active-link">About author</RouterLink>
    <RouterLink v-if="isAuthenticated" to="/users" active-class="active-link">Users</RouterLink>
    <RouterLink v-if="!isAuthenticated" to="/login" active-class="active-link">Login</RouterLink>
    <a v-else href="#" @click.prevent="handleLogout" class="logout-btn">Logout</a>
  </nav>
</template>

<style scoped lang="scss">
.nav-links {
  display: flex;
  gap: 1rem;
}
.logout-btn {
  cursor: pointer;
}
</style>