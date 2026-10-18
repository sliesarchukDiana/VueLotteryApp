<script setup lang="ts">
import type { User } from '../model/user';

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
  background: #4338ca;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 8px;
  margin-bottom: 8px;
  box-shadow: 0 4px 6px rgb(20 6 217 / 0.25);
  transition: transform 0.2s ease;
  border: 1px solid rgb(20 6 217 / 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgb(20 6 217 / 0.35);
  }
}

.winner-name {
  margin-right: 8px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.remove-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  line-height: 1;
  padding: 0;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    color: #fff;
  }
}
</style>