<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const authError = ref('')

const validationSchema = toTypedSchema(
    z.object({
      username: z.string().min(1, 'Username обов\'язковий'),
      password: z.string().min(6, 'Пароль має містити щонайменше 6 символів')
    })
)

const { handleSubmit, errors } = useForm({
  validationSchema
})

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
  <div class="login-container card-custom">
    <h2>Вхід</h2>
    <form @submit.prevent="onSubmit">
      <BaseInput
          v-model="username"
          label="Username"
          placeholder="Введіть username"
          :error-message="errors.username"
      />

      <BaseInput
          v-model="password"
          type="password"
          label="Пароль"
          placeholder="Введіть пароль"
          :error-message="errors.password"
      />

      <div v-if="authError" class="error-msg">{{ authError }}</div>

      <BaseButton type="submit" :disabled="isLoading">
        {{ isLoading ? 'Завантаження...' : 'Увійти' }}
      </BaseButton>
    </form>

    <div class="test-credentials">
      <small>Тестові дані: emilys / emilyspass</small>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
}
.error-msg {
  color: #e57373;
  margin-bottom: 1rem;
  font-size: 14px;
}
.test-credentials {
  margin-top: 1rem;
  color: #666;
}
</style>