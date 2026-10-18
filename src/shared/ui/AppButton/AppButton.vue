<script setup lang="ts">
import Button from 'primevue/button';

defineProps<{
  label?: string;
  disabled?: boolean;
  severity?: 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help' | 'contrast';
  type?: 'button' | 'submit' | 'reset';
}>();

defineEmits<{ (e: 'click', event: MouseEvent): void }>();
</script>

<template>
  <Button
      :label="label"
      :disabled="disabled"
      :severity="severity"
      :type="type"
      @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>