<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../entities/session/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
})
</script>

<template>
  <component :is="route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>