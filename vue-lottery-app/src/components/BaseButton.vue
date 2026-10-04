<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn-custom"
    :class="`btn-${variant}`"
    @click="$emit('click',$event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn-custom {
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.btn-primary {
  background-color: #2bbbad;
  color: #ffffff;

  &:hover:not(:disabled) {
    background-color: #249d91;
  }
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333333;

  &:hover:not(:disabled) {
    background-color: #d4d4d4;
  }
}

.btn-danger {
  background-color: #e57373;
  color: #ffffff;

  &:hover:not(:disabled) {
    background-color: #d32f2f;
  }
}
</style>