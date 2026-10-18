<script setup lang="ts">
import Dialog from 'primevue/dialog';
import AppButton from '../AppButton/AppButton.vue';

defineProps<{
  isOpen: boolean;
  title?: string;
  message?: string;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <Dialog
      :visible="isOpen"
      modal
      :header="title || 'Підтвердження'"
      :style="{ width: '25rem', maxWidth: '90vw' }"
      @update:visible="!$event ? $emit('close') : null"
  >
    <p style="margin: 0;">{{ message || 'Ви впевнені, що хочете виконати цю дію?' }}</p>

    <template #footer>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <AppButton
            label="Скасувати"
            severity="secondary"
            @click="$emit('close')"
        />
        <AppButton
            label="Видалити"
            severity="danger"
            @click="$emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>