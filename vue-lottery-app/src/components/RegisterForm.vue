<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Participant, ValidationErrors } from '../types/participant';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  (e: 'add-participant', participant: Participant): void;
}>();

const formData = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
});

const errors = reactive<ValidationErrors>({});
const isSubmitted = ref(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const validate = (): boolean => {
  let isValid = true;
  errors.name = '';
  errors.dateOfBirth = '';
  errors.email = '';
  errors.phone = '';

  if (!formData.name.trim()) {
    errors.name = 'This value is required.';
    isValid = false;
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'This value is required.';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future.';
      isValid = false;
    }
  }

  if (!formData.email.trim()) {
    errors.email = 'This value is required.';
    isValid = false;
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  } else if (
    props.existingEmails.some(
      (email) => email.toLowerCase() === formData.email.trim().toLowerCase()
    )
  ) {
    errors.email = 'A participant with this email already exists.';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = 'This value is required.';
    isValid = false;
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Phone number must match format +380XXXXXXXXX.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  isSubmitted.value = true;
  if (!validate()) {
    return;
  }

  const newParticipant: Participant = {
    id: Date.now().toString(),
    name: formData.name.trim(),
    dateOfBirth: formData.dateOfBirth,
    email: formData.email.trim(),
    phone: formData.phone.trim()
  };

  emit('add-participant', newParticipant);

  formData.name = '';
  formData.dateOfBirth = '';
  formData.email = '';
  formData.phone = '';
  errors.name = '';
  errors.dateOfBirth = '';
  errors.email = '';
  errors.phone = '';
  isSubmitted.value = false;
};
</script>

<template>
  <div class="card-custom register-form-card">
    <div class="form-header">
      <h3 class="form-title">REGISTER FORM</h3>
      <p class="form-subtitle">Please fill in all the fields.</p>
    </div>

    <form @submit.prevent="handleSubmit" @keyup.enter="handleSubmit">
      <BaseInput
        v-model="formData.name"
        label="Name"
        placeholder="Enter user name"
        :error-message="errors.name"
        :is-valid="isSubmitted && !errors.name"
      />

      <BaseInput
        v-model="formData.dateOfBirth"
        type="date"
        label="Date of Birth"
        placeholder="yyyy-mm-dd"
        :error-message="errors.dateOfBirth"
        :is-valid="isSubmitted && !errors.dateOfBirth"
      />

      <BaseInput
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error-message="errors.email"
        :is-valid="isSubmitted && !errors.email"
      />

      <BaseInput
        v-model="formData.phone"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error-message="errors.phone"
        :is-valid="isSubmitted && !errors.phone"
      />

      <div class="button-container">
        <BaseButton type="submit" variant="primary">Save</BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.register-form-card {
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  border: 1px solid #e1e4e8;
}

.form-header {
  margin-bottom: 1.25rem;

  .form-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0 0 4px 0;
    color: #333333;
  }

  .form-subtitle {
    font-size: 12px;
    color: #7a7a7a;
    margin: 0;
  }
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>