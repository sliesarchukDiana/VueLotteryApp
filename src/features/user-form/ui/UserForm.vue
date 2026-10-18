<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { AppInput, AppButton, useNotification } from '@/shared/ui'

const notification = useNotification()
const props = defineProps<{ id?: string }>()
const router = useRouter()

const usersStore = useUsersStore()
const { isLoading, error } = storeToRefs(usersStore)

const isEditing = computed(() => !!props.id)

const schema = toTypedSchema(
    z.object({
      firstName: z.string().min(1, 'Обов\'язкове поле'),
      lastName: z.string().min(1, 'Обов\'язкове поле'),
      email: z.string().email('Некоректний email'),
      username: z.string().min(3, 'Мінімум 3 символи'),
      password: z.string().min(6, 'Мінімум 6 символів'),
      age: z.number().min(1, 'Вік має бути більше 0'),
      gender: z.string().min(1, 'Обов\'язкове поле'),
      phone: z.string().min(5, 'Обов\'язкове поле')
    })
)

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: { age: 18 }
})

const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')
const { value: age } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone } = useField<string>('phone')

onMounted(async () => {
  if (isEditing.value) {
    try {
      const data = await usersStore.getUserById(Number(props.id))
      setValues(data)
    } catch (e: any) {
      notification.error('Помилка', e.message || 'Не вдалося завантажити дані користувача для редагування')
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      await usersStore.updateUser(Number(props.id), values)
      notification.success('Успіх', 'Користувача оновлено')
    } else {
      await usersStore.addUser(values)
      notification.success('Успіх', 'Користувача створено')
    }
    router.push('/users')
  } catch (e: any) {
    notification.error('Помилка', e.message || 'Щось пішло не так')
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading && isEditing">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <form v-else @submit.prevent="onSubmit">
      <AppInput v-model="firstName" label="Ім'я" :error-message="errors.firstName" />
      <AppInput v-model="lastName" label="Прізвище" :error-message="errors.lastName" />
      <AppInput v-model="email" type="email" label="Email" :error-message="errors.email" />
      <AppInput v-model="username" label="Username" :error-message="errors.username" />
      <AppInput v-model="password" type="password" label="Пароль" :error-message="errors.password" />
      <AppInput v-model.number="age" type="number" label="Вік" :error-message="errors.age" />
      <AppInput v-model="gender" label="Стать (male/female)" :error-message="errors.gender" />
      <AppInput v-model="phone" label="Телефон" :error-message="errors.phone" />

      <div class="actions">
        <AppButton type="button" label="Скасувати" severity="secondary" @click="router.back()" />
        <AppButton type="submit" :label="isEditing ? 'Зберегти' : 'Створити'" :disabled="isLoading" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.error {
  color: red;
  margin-bottom: 15px;
}
</style>