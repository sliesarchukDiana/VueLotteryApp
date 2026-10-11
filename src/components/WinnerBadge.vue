<script setup lang="ts">
import type { User } from '../types/user';

defineProps<{ winner: User }>();
defineEmits<{ (e: 'remove', id: number): void }>();
</script>

<template>
  <span class="winner-badge">
    <span class="winner-name">{{ winner.firstName }} {{ winner.lastName }}</span>
    <button type="button" class="remove-btn" @click="$emit('remove', winner.id)">&times;</button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ec934b;
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
    color: #532000;
  }
}
</style>