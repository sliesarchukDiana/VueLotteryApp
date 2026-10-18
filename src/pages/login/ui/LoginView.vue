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
  max-width: 420px;
  margin: 10vh auto;
  padding: 2.5rem 2rem;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
}
.test-credentials {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-color);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>