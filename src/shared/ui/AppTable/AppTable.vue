<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

interface TableColumn {
  field: string;
  header: string;
}

defineProps<{
  value: any[];
  columns: TableColumn[];
  loading?: boolean;
}>();
</script>

<template>
  <DataTable
      :value="value"
      :loading="loading"
      dataKey="id"
      stripedRows
      responsiveLayout="scroll"
  >
    <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
    >
      <template #body="{ data }">
        <slot v-if="$slots[col.field]" :name="col.field" :item="data" />
        <span v-else>{{ data[col.field] }}</span>
      </template>
    </Column>

    <Column header="Дії" v-if="$slots.actions">
      <template #body="{ data }">
        <slot name="actions" :item="data" />
      </template>
    </Column>

    <template #empty>
      <div style="text-align: center; padding: 1rem;">
        Немає даних для відображення.
      </div>
    </template>
  </DataTable>
</template>