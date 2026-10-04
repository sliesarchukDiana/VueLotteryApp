<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  isValid?: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="input-group-custom">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        class="form-field"
        :class="{
          'is-invalid': !!errorMessage,
          'is-valid': isValid && !errorMessage
        }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="isValid && !errorMessage" class="valid-icon">✓</span>
    </div>
    <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
  </div>
</template>

<style scoped lang="scss">
.input-group-custom {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
}

.input-label {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-field {
  width: 100%;
  padding: 8px 12px;
  background-color: #f7f7f8;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    background-color: #ffffff;
    border-color: #2bbbad;
  }

  &.is-invalid {
    border-color: #e57373;
    background-color: #fff;
  }

  &.is-valid {
    border-color: #2bbbad;
    padding-right: 32px;
  }
}

.valid-icon {
  position: absolute;
  right: 10px;
  color: #2bbbad;
  font-weight: bold;
}

.error-text {
  color: #e57373;
  font-size: 12px;
  margin-top: 4px;
}
</style>