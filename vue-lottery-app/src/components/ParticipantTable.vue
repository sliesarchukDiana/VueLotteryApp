<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Participant, SortField, SortOrder, ValidationErrors } from '../types/participant';
import SearchBar from './SearchBar.vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import BaseInput from './BaseInput.vue';

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  (e: 'update-participant', updated: Participant): void;
  (e: 'delete-participant', id: string): void;
}>();

const searchQuery = ref('');
const handleFilterByName = (query: string) => {
  searchQuery.value = query;
};

const sortField = ref<SortField>('name');
const sortOrder = ref<SortOrder>('asc');

const toggleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const processedParticipants = computed(() => {
  let list = [...props.participants];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  list.sort((a, b) => {
    let comp = 0;
    if (sortField.value === 'name') {
      comp = a.name.localeCompare(b.name);
    } else if (sortField.value === 'dateOfBirth') {
      comp = new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
    }
    return sortOrder.value === 'asc' ? comp : -comp;
  });

  return list;
});

const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (participantToDelete.value) {
    emit('delete-participant', participantToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
  participantToDelete.value = null;
};

const isEditModalOpen = ref(false);
const editForm = reactive({
  id: '',
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
});
const editErrors = reactive<ValidationErrors>({});

const openEditModal = (p: Participant) => {
  editForm.id = p.id;
  editForm.name = p.name;
  editForm.dateOfBirth = p.dateOfBirth;
  editForm.email = p.email;
  editForm.phone = p.phone;

  editErrors.name = '';
  editErrors.dateOfBirth = '';
  editErrors.email = '';
  editErrors.phone = '';
  isEditModalOpen.value = true;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const saveEdit = () => {
  let valid = true;
  editErrors.name = '';
  editErrors.dateOfBirth = '';
  editErrors.email = '';
  editErrors.phone = '';

  if (!editForm.name.trim()) {
    editErrors.name = 'This value is required.';
    valid = false;
  }

  if (!editForm.dateOfBirth) {
    editErrors.dateOfBirth = 'This value is required.';
    valid = false;
  } else {
    const selDate = new Date(editForm.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selDate > today) {
      editErrors.dateOfBirth = 'Date cannot be in the future.';
      valid = false;
    }
  }

  if (!editForm.email.trim()) {
    editErrors.email = 'This value is required.';
    valid = false;
  } else if (!emailRegex.test(editForm.email.trim())) {
    editErrors.email = 'Invalid email address.';
    valid = false;
  } else {
    const isDuplicate = props.participants.some(
      (p) => p.id !== editForm.id && p.email.toLowerCase() === editForm.email.trim().toLowerCase()
    );
    if (isDuplicate) {
      editErrors.email = 'A participant with this email already exists.';
      valid = false;
    }
  }

  if (!editForm.phone.trim()) {
    editErrors.phone = 'This value is required.';
    valid = false;
  } else if (!phoneRegex.test(editForm.phone.trim())) {
    editErrors.phone = 'Phone must be in format +380XXXXXXXXX.';
    valid = false;
  }

  if (!valid) return;

  emit('update-participant', {
    id: editForm.id,
    name: editForm.name.trim(),
    dateOfBirth: editForm.dateOfBirth,
    email: editForm.email.trim(),
    phone: editForm.phone.trim()
  });

  isEditModalOpen.value = false;
};
</script>

<template>
  <div class="card-custom table-card">
    <SearchBar @filter-by-name="handleFilterByName" />

    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th class="sortable" @click="toggleSort('name')">
              Name
              <span class="sort-icon">{{ sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('dateOfBirth')">
              Date of Birth
              <span class="sort-icon">{{ sortField === 'dateOfBirth' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span>
            </th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="processedParticipants.length === 0">
            <td colspan="6" class="text-center empty-msg">Немає зареєстрованих учасників</td>
          </tr>
          <tr v-for="(participant, index) in processedParticipants" :key="participant.id">
            <td>{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ participant.dateOfBirth }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
            <td class="actions-cell">
              <BaseButton variant="secondary" @click="openEditModal(participant)">
                Редагувати дані
              </BaseButton>
              <BaseButton variant="danger" @click="openDeleteModal(participant)">
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :is-open="isDeleteModalOpen" title="Підтвердження видалення" @close="isDeleteModalOpen = false">
      <p v-if="participantToDelete">
        Ви дійсно бажаєте видалити учасника "{{ participantToDelete.name }}", "{{ participantToDelete.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </BaseModal>

    <BaseModal :is-open="isEditModalOpen" title="Редагування учасника" @close="isEditModalOpen = false">
      <div>
        <BaseInput v-model="editForm.name" label="Name" :error-message="editErrors.name" />
        <BaseInput v-model="editForm.dateOfBirth" type="date" label="Date of Birth" :error-message="editErrors.dateOfBirth" />
        <BaseInput v-model="editForm.email" type="email" label="Email" :error-message="editErrors.email" />
        <BaseInput v-model="editForm.phone" label="Phone number" :error-message="editErrors.phone" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="isEditModalOpen = false">Скасувати</BaseButton>
        <BaseButton variant="primary" @click="saveEdit">Оновити дані</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #e1e4e8;
}

.custom-table {
  width: 100%;
  margin-bottom: 0;

  th {
    background-color: #fafbfc;
    color: #4a4a4a;
    font-size: 13px;
    border-bottom: 1px solid #e1e4e8;
    user-select: none;

    &.sortable {
      cursor: pointer;
      &:hover {
        background-color: #f1f3f5;
      }
    }
  }

  td {
    font-size: 13px;
    vertical-align: middle;
    border-bottom: 1px solid #f0f2f5;
  }
}

.sort-icon {
  margin-left: 4px;
  font-size: 11px;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.empty-msg {
  padding: 1.5rem;
  color: #888;
}
</style>