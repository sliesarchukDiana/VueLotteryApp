<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/entities/session'
import Toast from 'primevue/toast' // Додано

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
  <Toast />
</template>