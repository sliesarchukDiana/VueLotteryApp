<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { AppTable, AppConfirmDialog, AppButton, AppInput } from '@/shared/ui'
import { useNotification } from '@/shared/ui';

const emit = defineEmits<{ (e: 'user-deleted', id: number): void }>()
const route = useRoute()
const router = useRouter()
const notification = useNotification();

const usersStore = useUsersStore()
const { users, total, isLoading, error } = storeToRefs(usersStore)

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
  try {
    const skip = (currentPage.value - 1) * limit
    await usersStore.fetchUsers({ limit, skip, q: searchQuery.value })
  } catch (e) { /* empty */ }
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
    notification.success('Успіх', 'Користувача видалено')
    await fetchUsers()
  } catch (e: any) {
    notification.error('Помилка', e.message || 'Не вдалося видалити користувача')
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
      <AppButton label="Створити" severity="success" @click="router.push('/users/new')" />
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
          <AppButton label="Деталі" severity="info" @click="router.push(`/users/${item.id}`)" />
          <AppButton label="Редаг." severity="secondary" @click="router.push(`/users/${item.id}/edit`)" />
          <AppButton label="Видалити" severity="danger" @click="openDeleteModal(item.id)" />
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
        title="Видалення"
        message="Видалити користувача?"
        @close="isDeleteModalOpen = false"
        @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}
.search-input {
  flex: 1 1 300px;
}
.action-buttons {
  display: flex;
  gap: 8px;
  :deep(.p-button) {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
}
.pagination {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  span {
    font-weight: 500;
    min-width: 80px;
    text-align: center;
  }
}
.error {
  color: #ef4444;
  background: #fef2f2;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  border: 1px solid #fca5a5;
}
:root.dark-theme .error {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}
</style>