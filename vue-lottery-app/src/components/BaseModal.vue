<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  isOpen: boolean;
  title?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <div class="modal-header-custom">
            <slot name="header">
              <h5 class="modal-title">{{ title || 'Повідомлення' }}</h5>
            </slot>
            <button class="close-btn" @click="$emit('close')">&times;</button>
          </div>

          <div class="modal-body-custom">
            <slot name="body">
              <slot />
            </slot>
          </div>

          <div class="modal-footer-custom" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
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

/* CSS Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>