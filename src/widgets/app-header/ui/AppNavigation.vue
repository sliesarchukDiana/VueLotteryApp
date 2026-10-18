<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const sessionStore = useSessionStore()
const { isAuthenticated } = storeToRefs(sessionStore)

const handleLogout = () => {
  sessionStore.logout()
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
  gap: 0.5rem;
  align-items: center;

  a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    transition: var(--transition);
    opacity: 0.8;

    &:hover {
      opacity: 1;
      background: var(--bg-color);
    }

    &.active-link {
      opacity: 1;
      background: var(--primary-color);
      color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
    }
  }
}

.logout-btn {
  cursor: pointer;
  color: #ef4444 !important;

  &:hover {
    background: #fef2f2 !important;
  }
}

:root.dark-theme .logout-btn:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}
</style>