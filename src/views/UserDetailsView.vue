<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../stores/users'
import type { User } from '../types/user'

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id))
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="user-details card-custom">
    <h2>Деталі користувача</h2>
    <div v-if="isLoading">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="details-content">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Ім'я:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Вік:</strong> {{ user.age }}</p>
      <p><strong>Стать:</strong> {{ user.gender }}</p>
      <p><strong>Телефон:</strong> {{ user.phone }}</p>

      <button @click="router.back()" class="btn-secondary mt-3">Назад</button>
    </div>
  </div>
</template>

<style scoped>
.details-content p { margin: 5px 0; }
.mt-3 { margin-top: 15px; }
.error { color: red; }
</style>