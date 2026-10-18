<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppToast } from '@/shared/ui'

const route = useRoute()
const sessionStore = useSessionStore()

onMounted(() => {
  sessionStore.fetchUser()
})
</script>

<template>
  <component :is="route.meta.layout || 'div'">
    <RouterView />
  </component>
  <AppToast />
</template>