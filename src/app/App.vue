<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/entities/session'
import { AppToast } from '@/shared/ui'

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
  <AppToast />
</template>