<script setup lang="ts">
import { type User, WinnerBadge } from '@/entities/user';
import { AppButton } from '@/shared/ui';

defineProps<{
  winners: User[];
  canPickWinner: boolean;
}>();

defineEmits<{
  (e: 'pick-winner'): void;
  (e: 'remove-winner', id: number): void;
}>();
</script>

<template>
  <div class="card-custom winner-card">
    <div class="winner-input-area">
      <div class="winners-container">
  <template v-if="winners.length > 0">
    <WinnerBadge
      v-for="winner in winners"
      :key="winner.id"
      :winner="winner"
      @remove="$emit('remove-winner', $event)"
    />
  </template>
  <span v-else class="placeholder-text">Winners</span>
</div>

      <AppButton
        type="button"
        variant="primary"
        :disabled="!canPickWinner"
        @click="$emit('pick-winner')"
      >
        New winner
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.winner-card {
  max-width: 100%;
  background: var(--bg-color);
  border: 1px dashed var(--border-color);
  box-shadow: none;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.winner-input-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.winners-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 44px;
  flex-grow: 1;
  gap: 4px;
}

.placeholder-text {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
}
</style>