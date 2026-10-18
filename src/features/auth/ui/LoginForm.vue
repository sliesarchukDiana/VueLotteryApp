<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/entities/session'
import { AppInput, AppButton } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

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
    await authStore.login(values)
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
.error-msg {
  color: #e57373;
  margin-bottom: 1rem;
  font-size: 14px;
}
</style>