<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ServiceProvider } from '@/services/service-provider'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: 0
})

const isLoading = ref(true)
const isSaving = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const data = await ServiceProvider.users.getById(Number(props.id))
    formData.value = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})

const save = async () => {
  isSaving.value = true
  try {
    await ServiceProvider.users.update(Number(props.id), formData.value)
    router.push('/users')
  } catch (e: any) {
    error.value = e.message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="user-edit card-custom">
    <h2>Редагування користувача #{{ id }}</h2>

    <div v-if="isLoading">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <form v-else @submit.prevent="save">
      <BaseInput v-model="formData.firstName" label="Ім'я" />
      <BaseInput v-model="formData.lastName" label="Прізвище" />
      <BaseInput v-model="formData.email" type="email" label="Email" />
      <BaseInput v-model="formData.phone" label="Телефон" />
      <BaseInput v-model.number="formData.age" type="number" label="Вік" />

      <div class="actions">
        <BaseButton type="button" variant="secondary" @click="router.back()">Скасувати</BaseButton>
        <BaseButton type="submit" :disabled="isSaving">Зберегти</BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.actions { display: flex; gap: 10px; margin-top: 20px; }
.error { color: red; margin-bottom: 15px; }
</style>