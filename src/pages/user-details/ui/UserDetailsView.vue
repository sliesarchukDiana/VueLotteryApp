<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppButton, useNotification } from '@/shared/ui'

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const notification = useNotification()
const { isLoading, error } = storeToRefs(usersStore)

const user = ref<User | null>(null)

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id))
  } catch (e: any) {
    notification.error('Помилка', e.message || 'Не вдалося завантажити дані користувача')
  }
})
</script>

<template>
  <div class="user-details card-custom">
    <h2>Деталі користувача</h2>

    <div v-if="isLoading" class="loading-state">Завантаження...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else-if="user" class="details-content">
      <div class="info-list">
        <div class="info-item">
          <span class="label">ID</span>
          <span class="value">#{{ user.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">Ім'я</span>
          <span class="value">{{ user.firstName }} {{ user.lastName }}</span>
        </div>
        <div class="info-item">
          <span class="label">Email</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Username</span>
          <span class="value">@{{ user.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">Вік</span>
          <span class="value">{{ user.age }}</span>
        </div>
        <div class="info-item">
          <span class="label">Стать</span>
          <span class="value" style="text-transform: capitalize;">{{ user.gender }}</span>
        </div>
        <div class="info-item">
          <span class="label">Телефон</span>
          <span class="value">{{ user.phone }}</span>
        </div>
      </div>

      <div class="actions-footer">
        <AppButton
            label="Назад"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="router.back()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-state {
  color: var(--text-muted);
  font-weight: 500;
  padding: 1rem 0;
}
.error-msg {
  color: #ef4444;
  background: #fef2f2;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid #fecaca;
  margin-bottom: 1.5rem;
}
:root.dark-theme .error-msg {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}
.details-content {
  max-width: 900px;
}
.info-list {
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  padding: 0 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem 0;
  border-bottom: 1px dashed var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .value {
    font-size: 1.05rem;
    color: var(--text-color);
    font-weight: 500;
  }
}
.actions-footer {
  display: flex;
  justify-content: flex-start;
  padding-top: 0.5rem;
}
</style>