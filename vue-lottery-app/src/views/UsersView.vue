<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'
import WinnerBlock from '@/components/WinnerBlock.vue'

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref('')
const total = ref(0)
const limit = 10

const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')

// Логіка лотереї
const winners = ref<User[]>([])

const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false // Наприклад, максимум 3 переможці
  const availableParticipants = users.value.filter(
      (u) => !winners.value.some((w) => w.id === u.id)
  )
  return availableParticipants.length > 0
})

const handlePickWinner = () => {
  if (!canPickWinner.value) return
  const available = users.value.filter(
      (u) => !winners.value.some((w) => w.id === u.id)
  )
  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length)
    winners.value.push(available[randomIndex])
  }
}

const handleRemoveWinner = (id: number) => {
  winners.value = winners.value.filter((w) => w.id !== id)
}

// Робота з API
const fetchUsers = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const skip = (currentPage.value - 1) * limit
    const response = await ServiceProvider.users.getAll({
      limit,
      skip,
      q: searchQuery.value
    })
    users.value = response.items
    total.value = response.total
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

const updateUrl = () => {
  router.push({
    query: {
      ...route.query,
      page: currentPage.value > 1 ? currentPage.value : undefined,
      q: searchQuery.value || undefined
    }
  })
}

const handleSearch = () => {
  currentPage.value = 1
  updateUrl()
}

const changePage = (step: number) => {
  currentPage.value += step
  updateUrl()
}

const deleteUser = async (id: number) => {
  if (!confirm('Видалити користувача?')) return
  try {
    await ServiceProvider.users.delete(id)
    users.value = users.value.filter(u => u.id !== id)
    winners.value = winners.value.filter(w => w.id !== id) // Видаляємо і з переможців
  } catch (e: any) {
    alert(e.message)
  }
}

watch(() => route.query, () => {
  currentPage.value = Number(route.query.page) || 1
  searchQuery.value = (route.query.q as string) || ''
  fetchUsers()
})

onMounted(fetchUsers)
</script>

<template>
  <div class="users-page card-custom">

    <!-- Блок розіграшу лотереї -->
    <WinnerBlock
        :winners="winners"
        :can-pick-winner="canPickWinner"
        @pick-winner="handlePickWinner"
        @remove-winner="handleRemoveWinner"
    />

    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />

    <h2>Учасники (Користувачі)</h2>
    <div class="controls">
      <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="Пошук..."
          class="search-input"
      />
      <button @click="handleSearch" class="btn-primary">Шукати</button>
      <RouterLink to="/users/new/edit" class="btn-primary" style="text-decoration: none;">Додати учасника</RouterLink>
    </div>

    <div v-if="isLoading">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="table custom-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Ім'я</th>
        <th>Email</th>
        <th>Дії</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.firstName }} {{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>
          <RouterLink :to="`/users/${user.id}`" class="btn-secondary">Перегляд</RouterLink>
          <RouterLink :to="`/users/${user.id}/edit`" class="btn-secondary">Редагувати</RouterLink>
          <button @click="deleteUser(user.id)" class="btn-danger">Видалити</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="!isLoading && !error">
      <button :disabled="currentPage === 1" @click="changePage(-1)">Попередня</button>
      <span>Сторінка {{ currentPage }}</span>
      <button :disabled="users.length < limit" @click="changePage(1)">Наступна</button>
    </div>
  </div>
</template>

<style scoped>
.controls { display: flex; gap: 10px; margin-bottom: 20px; align-items: center;}
.search-input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex-grow: 1;}
.pagination { display: flex; gap: 15px; align-items: center; margin-top: 20px; justify-content: center; }
.btn-secondary, .btn-danger { padding: 4px 8px; margin-right: 5px; text-decoration: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
.btn-secondary { background: #e0e0e0; color: #333; }
.btn-danger { background: #d63131; color: white; border: none; }
.btn-primary { padding: 8px 16px; background-color: #ec934b; color: white; border: none; border-radius: 4px; cursor: pointer; }
.error { color: red; }
</style>