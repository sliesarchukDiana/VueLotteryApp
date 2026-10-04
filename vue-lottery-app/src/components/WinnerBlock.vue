<script setup lang="ts">
import type { Participant } from '../types/participant';
import WinnerBadge from './WinnerBadge.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  winners: Participant[];
  canPickWinner: boolean;
}>();

defineEmits<{
  (e: 'pick-winner'): void;
  (e: 'remove-winner', id: string): void;
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

      <BaseButton
        type="button"
        variant="primary"
        :disabled="!canPickWinner"
        @click="$emit('pick-winner')"
      >
        New winner
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.winner-card {
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  border: 1px solid #e1e4e8;
  padding: 8px 12px;
}

.winner-input-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.winners-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 38px;
  flex-grow: 1;
}

.placeholder-text {
  color: #9e9e9e;
  font-size: 14px;
}
</style>