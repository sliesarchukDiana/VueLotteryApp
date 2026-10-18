<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useSessionStore } from '@/entities/session'
import { AppInput, AppButton } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()

const isLoading = ref(false)
const authError = ref('')

const validationSchema = toTypedSchema(
    z.object({
      username: z.string().min(1, 'Username є обов\'язковим'),
      password: z.string().min(6, 'Пароль має містити мінімум 6 символів')
    })
)

const { handleSubmit, errors } = useForm({ validationSchema })
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  authError.value = ''
  try {
    await sessionStore.login(values)
    const redirectPath = (route.query.redirect as string) || '/users'
    router.push(redirectPath)
  } catch (e: any) {
    authError.value = e.response?.data?.message || 'Помилка авторизації'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <AppInput
        v-model="username"
        label="Username"
        placeholder="Введіть username"
        :error-message="errors.username"
    />
    <AppInput
        v-model="password"
        type="password"
        label="Пароль"
        placeholder="Введіть пароль"
        :error-message="errors.password"
    />
    <div v-if="authError" class="error-msg">{{ authError }}</div>

    <AppButton
        type="submit"
        :label="isLoading ? 'Вхід...' : 'Увійти'"
        :disabled="isLoading"
    />
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid #fecaca;
}

:root.dark-theme .error-msg {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

:deep(.p-button) {
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--primary-color) !important;
  color: #ffffff !important;
  border: none !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
  letter-spacing: 0.5px;
}

:deep(.p-button:hover) {
  background-color: var(--primary-hover) !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
}
</style>