<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AppButton } from '@/shared/ui'

const router = useRouter()
</script>

<template>
  <div class="not-found card-custom text-center">
    <h2>404 - Сторінка не знайдена</h2>
    <p>Схоже, ви перейшли за невірним посиланням.</p>

    <AppButton
        label="Повернутися на головну"
        @click="router.push('/')"
        style="margin-top: 15px;"
    />
  </div>
</template>

<style scoped>
.text-center { text-align: center; padding: 3rem 1rem; }
</style>