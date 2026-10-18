<script setup lang="ts">
import { LoginForm } from '@/features/auth'
</script>

<template>
  <div class="login-container card-custom">
    <h2>Вхід у систему</h2>
    <LoginForm />

    <div class="test-credentials">
      <small>Тестові дані: emilys/emilyspass</small>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
}
.test-credentials {
  margin-top: 1rem;
  color: #666;
}
</style>