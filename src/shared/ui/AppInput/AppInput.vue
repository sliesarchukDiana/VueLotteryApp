<script setup lang="ts">
import InputText from 'primevue/inputtext';

defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  errorMessage?: string;
  placeholder?: string;
}>();

defineEmits<{ (e: 'update:modelValue', value: string | number): void }>();
</script>

<template>
  <div class="app-input-group">
    <label v-if="label">{{ label }}</label>
    <InputText
        :type="type || 'text'"
        :modelValue="modelValue as string"
        :placeholder="placeholder"
        @update:modelValue="$emit('update:modelValue', $event as string)"
        :class="{ 'p-invalid': !!errorMessage }"
    />
    <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
  </div>
</template>

<style scoped>
.app-input-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.p-error { color: #e57373; font-size: 0.875rem; }
</style>