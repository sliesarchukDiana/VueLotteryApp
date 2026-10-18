<script setup lang="ts">
import { computed } from 'vue'
import { UserForm } from '@/features/user-form'

const props = defineProps<{ id?: string }>()
const isEditing = computed(() => !!props.id)
</script>

<template>
  <div class="user-edit card-custom">
    <h2>{{ isEditing ? `Редагування користувача #${id}` : 'Створення нового користувача' }}</h2>

    <UserForm :id="id" />
  </div>
</template>