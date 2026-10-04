<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <span class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button
      type="button"
      class="remove-btn"
      title="Видалити"
      @click="$emit('remove', winner.id)"
    >
      &times;
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #4fc3f7;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  margin-right: 6px;
  margin-bottom: 4px;
}

.winner-name {
  margin-right: 6px;
  font-weight: 500;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #0d47a1;
  }
}
</style>