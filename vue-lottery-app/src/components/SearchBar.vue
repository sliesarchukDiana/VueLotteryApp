<script setup lang="ts">
import { ref, watch } from 'vue';

const searchTerm = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void;
}>();

watch(searchTerm, (newVal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', newVal.trim());
  }, 300);
});
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Пошук за іменем..."
      class="search-input"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background-color: #ffffff;

  &:focus {
    border-color: #2bbbad;
  }
}
</style>