<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { AppTable, AppConfirmDialog, AppButton, AppInput } from '@/shared/ui'

const emit = defineEmits<{ (e: 'user-deleted', id: number): void }>()

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const { users, total } = storeToRefs(usersStore)

const isLoading = ref(false)
const error = ref('')
const limit = 10
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')

const isDeleteModalOpen = ref(false)
const userToDelete = ref<number | null>(null)

const tableColumns = [
  { field: 'id', header: 'ID' },
  { field: 'fullName', header: 'Ім\'я' },
  { field: 'email', header: 'Email' }
]

const fetchUsers = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const skip = (currentPage.value - 1) * limit
    await usersStore.fetchUsers({ limit, skip, q: searchQuery.value })
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

const openDeleteModal = (id: number) => {
  userToDelete.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (userToDelete.value === null) return
  try {
    await usersStore.deleteUser(userToDelete.value)
    emit('user-deleted', userToDelete.value)
    await fetchUsers()
  } catch (e: any) {
    error.value = e.message
  } finally {
    isDeleteModalOpen.value = false
    userToDelete.value = null
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
  <div class="users-table-widget">
    <div class="controls">
      <AppInput
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="Пошук..."
          class="search-input"
      />
      <AppButton label="Знайти" @click="handleSearch" />
      <AppButton label="Додати" severity="success" @click="router.push('/users/new')" />
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <AppTable
        v-if="!error"
        :value="users"
        :columns="tableColumns"
        :loading="isLoading"
    >
      <template #fullName="{ item }">
        {{ item.firstName }} {{ item.lastName }}
      </template>
      <template #actions="{ item }">
        <div class="action-buttons">
          <AppButton label="Пер." severity="info" @click="router.push(`/users/${item.id}`)" />
          <AppButton label="Ред." severity="secondary" @click="router.push(`/users/${item.id}/edit`)" />
          <AppButton label="Вид." severity="danger" @click="openDeleteModal(item.id)" />
        </div>
      </template>
    </AppTable>

    <div class="pagination" v-if="!isLoading && !error">
      <AppButton label="Назад" :disabled="currentPage === 1" @click="changePage(-1)" />
      <span>Сторінка {{ currentPage }}</span>
      <AppButton label="Вперед" :disabled="currentPage * limit >= total" @click="changePage(1)" />
    </div>

    <AppConfirmDialog
        :is-open="isDeleteModalOpen"
        title="Підтвердження"
        message="Ви дійсно хочете видалити цього користувача?"
        @close="isDeleteModalOpen = false"
        @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.controls { display: flex; gap: 10px; margin-bottom: 20px; align-items: flex-start; }
.search-input { flex-grow: 1; }
.action-buttons { display: flex; gap: 5px; }
.pagination { display: flex; gap: 15px; align-items: center; margin-top: 20px; justify-content: center; }
.error { color: red; margin-bottom: 1rem; }
</style>