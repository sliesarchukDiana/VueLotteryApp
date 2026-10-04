<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Participant } from './types/participant';
import WinnerBlock from './components/WinnerBlock.vue';
import RegisterForm from './components/RegisterForm.vue';
import ParticipantTable from './components/ParticipantTable.vue';

const STORAGE_KEY = 'vue_lottery_participants';

const participants = ref<Participant[]>([]);
const winners = ref<Participant[]>([]);

onMounted(() => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      participants.value = JSON.parse(savedData);
    } catch {
      participants.value = [];
    }
  }
});

watch(
  participants,
  (newParticipants) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newParticipants));
  },
  { deep: true }
);

const existingEmails = computed(() => participants.value.map((p) => p.email));

const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  const availableParticipants = participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );
  return availableParticipants.length > 0;
});

const handleAddParticipant = (newParticipant: Participant) => {
  participants.value.push(newParticipant);
};

const handleUpdateParticipant = (updated: Participant) => {
  const index = participants.value.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    participants.value[index] = updated;

    const winnerIndex = winners.value.findIndex((w) => w.id === updated.id);
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = updated;
    }
  }
};

const handleDeleteParticipant = (id: string) => {
  participants.value = participants.value.filter((p) => p.id !== id);
  winners.value = winners.value.filter((w) => w.id !== id);
};

const handlePickWinner = () => {
  if (!canPickWinner.value) return;

  const availableParticipants = participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );

  if (availableParticipants.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    winners.value.push(availableParticipants[randomIndex]);
  }
};

const handleRemoveWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};
</script>

<template>
  <main class="app-container">
    <WinnerBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <RegisterForm
      :existing-emails="existingEmails"
      @add-participant="handleAddParticipant"
    />

    <ParticipantTable
      :participants="participants"
      @update-participant="handleUpdateParticipant"
      @delete-participant="handleDeleteParticipant"
    />
  </main>
</template>

<style scoped lang="scss">
.app-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>