<template>
  <div class="w-full h-full flex flex-col overflow-hidden bg-[#1e1e1e]">
    <DataTable
      :value="appStore.metadata"
      :loading="metadataStore.loading"
      stripedRows
      responsiveLayout="scroll"
      class="flex-1"
      paginator
      scrollable
      scrollHeight="flex"
      :rows="rows"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} metadatos"
      resizableColumns
      columnResizeMode="expand"
      :pt="tablePt"
    >
      <template #empty>
        <div class="text-center py-6 text-gray-400 font-medium">
          No se encontraron metadatos registrados.
        </div>
      </template>

      <template #loading>
        <div class="text-center py-6 text-gray-400 font-medium">
          Cargando metadatos...
        </div>
      </template>

      <Column
        v-for="col in metadataStore.selectedColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable !== false"
      >
        <template #body="slotProps">
          <div class="pt-1.5">
            <span>{{ formatCellValue(slotProps.data[col.field], col.type) }}</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
/**
 * MetadataTable.vue
 * -----------------
 * Component responsible for displaying a dynamic PrimeVue DataTable based on the selected columns
 * configured in metadataStore and the metadata array stored in appStore, fully styled with Tailwind CSS.
 *
 * This component connects to `appStore` to fetch the table dataset (`metadata`) and to
 * `metadataStore` to retrieve active columns (`selectedColumns`). It renders each column dynamically,
 * formats values based on column type, and applies Tailwind CSS styles using PrimeVue Pass-Through (pt) props.
 */

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useMetadataStore } from '@/stores/metadataStore'

// Instantiate Pinia stores
const appStore = useAppStore()
const metadataStore = useMetadataStore()
const rows = computed(() => metadataStore.pagination.rows)

/**
 * Pass-through configuration object for PrimeVue DataTable styling using Tailwind CSS utility classes.
 *
 * This object defines Tailwind CSS utility classes for internal elements of the PrimeVue DataTable
 * (header cells, body cells, rows, hover states, scrollbars, and pagination buttons), matching main.css styles using Tailwind.
 */
const tablePt = {
  root: { class: 'bg-transparent text-gray-200 w-full' },
  table: { class: 'bg-transparent border-separate border-spacing-0 whitespace-nowrap w-full' },
  wrapper: { class: 'rounded-[10px] overflow-x-auto' },
  headerRow: { class: 'bg-[#252526]' },
  headerCell: {
    class: '!bg-[#252526] !text-[#d4d4d4] text-xs font-semibold px-4 py-3.5 !border-b !border-[#3c3c3c] hover:!bg-[#2d2d30] transition-colors min-w-[180px]'
  },
  bodyRow: {
    class: 'transition-colors hover:bg-[#252526] [&.p-highlight]:bg-[#10b981]/15 [&.p-highlight]:text-white'
  },
  bodyCell: {
    class: '!bg-[#1e1e1e] text-gray-200 px-4 py-3 !border-b !border-[#2f2f2f] align-middle min-w-[180px]'
  },
  columnResizer: { class: 'bg-transparent w-1 hover:bg-[#10b981] transition-colors' },
  paginator: {
    root: { class: '!bg-transparent !border-none pt-4 flex items-center justify-end gap-1 text-xs' },
    pageButton: ({ context }) => ({
      class: [
        'px-3 py-1 text-[#d4d4d4] rounded-[6px] transition-colors hover:bg-[#2d2d30]',
        context?.active ? '!bg-[#10b981] !text-white font-bold' : ''
      ]
    }),
    firstPageButton: { class: 'p-2 text-[#d4d4d4] rounded-[6px] transition-colors hover:bg-[#2d2d30]' },
    prevPageButton: { class: 'p-2 text-[#d4d4d4] rounded-[6px] transition-colors hover:bg-[#2d2d30]' },
    nextPageButton: { class: 'p-2 text-[#d4d4d4] rounded-[6px] transition-colors hover:bg-[#2d2d30]' },
    lastPageButton: { class: 'p-2 text-[#d4d4d4] rounded-[6px] transition-colors hover:bg-[#2d2d30]' }
  }
}

/**
 * Formats a cell value according to its column data type for clean visual output.
 *
 * Takes a raw cell value and its column type (e.g., 'currency', 'date') and returns a properly
 * formatted string representation. If the value is null or undefined, returns a fallback hyphen.
 *
 * @param {any} value - The raw value stored in the row field.
 * @param {string} type - The type specified in the column schema ('currency', 'date', etc.).
 * @returns {string} The formatted string to be rendered in the table cell.
 */
const formatCellValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (type === 'currency') {
    const numericValue = Number(value)
    if (isNaN(numericValue)) return value
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(numericValue)
  }

  if (type === 'date' && value) {
    try {
      const dateObj = new Date(value)
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('es-MX')
      }
    } catch {
      return value
    }
  }

  return String(value)
}

onMounted(() => {
  metadataStore.fetchMetadata()
})
</script>