<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { WinnerBlock } from '@/features/lottery'
import type { User } from '@/entities/user'
import { UsersTable } from '@/widgets/users-table'

const usersStore = useUsersStore()
const { users } = storeToRefs(usersStore)

const winners = ref<User[]>([])

const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false
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

const handleUserDeleted = (id: number) => {
  handleRemoveWinner(id)
}
</script>

<template>
  <div class="users-page card-custom">
    <WinnerBlock
        :winners="winners"
        :can-pick-winner="canPickWinner"
        @pick-winner="handlePickWinner"
        @remove-winner="handleRemoveWinner"
    />
    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
    <h2>Користувачі</h2>

    <UsersTable @user-deleted="handleUserDeleted" />
  </div>
</template>
