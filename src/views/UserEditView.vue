<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ServiceProvider } from '../services/service-provider'
import { useUsersStore } from '../stores/users'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const isLoading = ref(false)
const error = ref('')

const isEditing = computed(() => !!props.id)

const schema = toTypedSchema(
    z.object({
      firstName: z.string().min(1, 'Обов\'язкове поле'),
      lastName: z.string().min(1, 'Обов\'язкове поле'),
      email: z.string().email('Некоректний email'),
      username: z.string().min(3, 'Мінімум 3 символи'),
      password: z.string().min(6, 'Мінімум 6 символів'),
      age: z.number().min(1, 'Некоректний вік'),
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
    isLoading.value = true
    try {
      const data = await ServiceProvider.users.getById(Number(props.id))
      setValues(data)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await usersStore.updateUser(Number(props.id), values)
    } else {
      await usersStore.addUser(values)
    }
    router.push('/users')
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="user-edit card-custom">
    <h2>{{ isEditing ? `Редагування юзера #${id}` : 'Новий юзер' }}</h2>

    <div v-if="isLoading && isEditing">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <form v-else @submit.prevent="onSubmit">
      <BaseInput v-model="firstName" label="Ім'я" :error-message="errors.firstName" />
      <BaseInput v-model="lastName" label="Прізвище" :error-message="errors.lastName" />
      <BaseInput v-model="email" type="email" label="Email" :error-message="errors.email" />
      <BaseInput v-model="username" label="Username" :error-message="errors.username" />
      <BaseInput v-model="password" type="password" label="Пароль" :error-message="errors.password" />
      <BaseInput v-model.number="age" type="number" label="Вік" :error-message="errors.age" />

      <BaseInput v-model="gender" label="Стать (male/female)" :error-message="errors.gender" />

      <BaseInput v-model="phone" label="Телефон" :error-message="errors.phone" />

      <div class="actions">
        <BaseButton type="button" variant="secondary" @click="router.back()">Скасувати</BaseButton>
        <BaseButton type="submit" :disabled="isLoading">Зберегти</BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.actions { display: flex; gap: 10px; margin-top: 20px; }
.error { color: red; margin-bottom: 15px; }
</style>