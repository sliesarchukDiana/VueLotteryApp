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

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 480px;
  margin: 1rem;
}

.modal-content-custom {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid #edf2f7;

  .modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    color: #888;

    &:hover {
      color: #222;
    }
  }
}

.modal-body-custom {
  padding: 18px;
  font-size: 14px;
}

.modal-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 18px;
  background-color: #fafbfc;
  border-top: 1px solid #edf2f7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>