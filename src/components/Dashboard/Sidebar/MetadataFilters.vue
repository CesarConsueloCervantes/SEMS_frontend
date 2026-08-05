<template>
    <div class="flex flex-col gap-3 ">
      <div
        v-for="col in metadataStore.columns"
        :key="col.field"
        class="flex flex-col gap-2 p-2 bg-[#252526] border border-[#333333] rounded-lg transition-colors hover:border-[#444444]"
      >
        <div class="flex items-center gap-2.5 cursor-pointer" @click="handleVisibilityToggle(col.field)">
          <Checkbox
            :modelValue="col.visible"
            :binary="true"
            class="text-emerald-500"
          />
          <span class="text-xs font-medium text-gray-200 select-none">
            {{ col.header }}
          </span>
        </div>

        <div v-if="col.visible" class="pl-6 pt-1 flex flex-col gap-2">
          <div v-if="col.type === 'enum'">
            <MultiSelect
              :modelValue="col.filter.value"
              :options="getEnumOptions(col.field)"
              placeholder="Seleccionar..."
              class="w-full text-xs bg-[#1e1e1e] border-[#333333] text-gray-200 rounded-lg shadow-sm"
              panelClass="!bg-[#1e1e1e] !border !border-[#333333] !rounded-xl !shadow-2xl !p-2"
              @update:modelValue="(val) => handleEnumChange(col.field, val)"
            />
          </div>

          <div v-else-if="col.type === 'text'">
            <InputText
              :modelValue="col.filter.value"
              placeholder="Buscar..."
              class="w-full text-xs px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
              @update:modelValue="(val) => handleTextChange(col.field, val)"
            />
          </div>

          <div v-else-if="col.type === 'date'" class="flex flex-col gap-2">
            <div class="flex flex-col w-full">
              <span class="text-[10px] font-semibold text-gray-400 mb-0.5">Desde</span>
              <input
                type="date"
                :value="getDateValue(col, 'start')"
                @change="(e) => handleDateChange(col, 'start', e.target.value)"
                class="w-full text-xs px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div class="flex flex-col w-full">
              <span class="text-[10px] font-semibold text-gray-400 mb-0.5">Hasta</span>
              <input
                type="date"
                :value="getDateValue(col, 'end')"
                @change="(e) => handleDateChange(col, 'end', e.target.value)"
                class="w-full text-xs px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div v-else-if="col.type === 'currency'" class="flex flex-col gap-2">
            <div class="flex flex-col w-full">
              <span class="text-[10px] font-semibold text-gray-400 mb-0.5">Mínimo</span>
              <input
                type="number"
                placeholder="0.00"
                :value="getCurrencyValue(col, 'min')"
                @input="(e) => handleCurrencyChange(col, 'min', e.target.value)"
                class="w-full text-xs px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div class="flex flex-col w-full">
              <span class="text-[10px] font-semibold text-gray-400 mb-0.5">Máximo</span>
              <input
                type="number"
                placeholder="0.00"
                :value="getCurrencyValue(col, 'max')"
                @input="(e) => handleCurrencyChange(col, 'max', e.target.value)"
                class="w-full text-xs px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
/**
 * MetadataFilters.vue
 * -------------------
 * Component that renders a list of metadata filters based on columns defined in metadataStore.
 *
 * This component presents a list of configurable filters corresponding to metadata columns.
 * Each item has a checkbox to toggle column visibility. When visible, input controls are rendered vertically
 * below the filter title (MultiSelect with card menu for enum, InputText for text, vertical date range, and vertical currency range).
 * All filter inputs update values via metadataStore.updateFilterValues and re-fetch metadata automatically.
 */

import { onMounted } from 'vue'
import Checkbox from 'primevue/checkbox'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import { useMetadataStore } from '@/stores/metadataStore'

// Instantiate Pinia store for metadata
const metadataStore = useMetadataStore()

/**
 * Toggles column visibility state and immediately triggers metadata re-fetching.
 *
 * Calls changeVisibleColumn in metadataStore to switch column visibility, and then executes
 * fetchMetadata to retrieve updated metadata from backend services.
 * 
 * @param {string} field - The field identifier of the column being toggled.
 */
const handleVisibilityToggle = (field) => {
  metadataStore.changeVisibleColumn(field)
  metadataStore.fetchMetadata()
}

/**
 * Sends updated enum filter values to metadataStore and triggers metadata re-fetching.
 *
 * Dispatches the selected enum array to `metadataStore.updateFilterValues` and calls `metadataStore.fetchMetadata`.
 *
 * @param {string} field - The field identifier of the target column.
 * @param {Array} val - Array of selected enum option values.
 */
const handleEnumChange = (field, val) => {
  metadataStore.updateFilterValues(field, val)
  metadataStore.fetchMetadata()
}

/**
 * Sends updated text filter values to metadataStore and triggers metadata re-fetching.
 *
 * Dispatches text filter changes to `metadataStore.updateFilterValues` and executes `metadataStore.fetchMetadata`.
 *
 * @param {string} field - The field identifier of the target column.
 * @param {string} val - The query string typed by the user.
 */
const handleTextChange = (field, val) => {
  metadataStore.updateFilterValues(field, val)
  metadataStore.fetchMetadata()
}

/**
 * Updates vertical date range values (start/end) in metadataStore and triggers metadata re-fetching.
 *
 * Constructs a date range object { start, end } for the specified date column, updates it in `metadataStore.updateFilterValues`, and calls `metadataStore.fetchMetadata`.
 *
 * @param {Object} col - The column configuration object.
 * @param {string} key - Parameter key ('start' or 'end').
 * @param {string} val - Date input string value.
 */
const handleDateChange = (col, key, val) => {
  const current = (col.filter.value && typeof col.filter.value === 'object')
    ? { ...col.filter.value }
    : { start: '', end: '' }

  current[key] = val
  metadataStore.updateFilterValues(col.field, current)
  metadataStore.fetchMetadata()
}

/**
 * Updates vertical currency range values (min/max) in metadataStore and triggers metadata re-fetching.
 *
 * Constructs a currency range object { min, max } for the price column, updates it in `metadataStore.updateFilterValues`, and invokes `metadataStore.fetchMetadata`.
 *
 * @param {Object} col - The column configuration object.
 * @param {string} key - Parameter key ('min' or 'max').
 * @param {string} val - Numeric input string value.
 */
const handleCurrencyChange = (col, key, val) => {
  const current = (col.filter.value && typeof col.filter.value === 'object')
    ? { ...col.filter.value }
    : { min: null, max: null }

  current[key] = val !== '' ? Number(val) : null
  metadataStore.updateFilterValues(col.field, current)
  metadataStore.fetchMetadata()
}

/**
 * Retrieves the available options array for enum type filters.
 *
 * Returns an array of options for enum fields. For the 'estatus' column, returns fixed values [1, 0].
 * For other enum fields, fetches options from metadataStore.filterOptions.
 * 
 * @param {string} field - The column field identifier.
 * @returns {Array} Array of option items for select inputs.
 */
const getEnumOptions = (field) => {
  if (field === 'estatus') {
    return [1, 0]
  }
  return metadataStore.filterOptions[field] || []
}

/**
 * Helper to safely extract start or end date values from column filter object.
 *
 * Reads the start or end date property from column.filter.value if defined.
 * 
 * @param {Object} col - The column configuration object.
 * @param {string} key - Specify 'start' or 'end'.
 * @returns {string} The date string or empty string.
 */
const getDateValue = (col, key) => {
  if (!col.filter.value || typeof col.filter.value !== 'object') {
    return ''
  }
  return col.filter.value[key] || ''
}

/**
 * Helper to safely extract minimum or maximum currency filter values.
 *
 * Reads the min or max price property from column.filter.value if defined.
 *
 * @param {Object} col - The column configuration object.
 * @param {string} key - Specify 'min' or 'max'.
 * @returns {string|number} The numeric value or empty string.
 */
const getCurrencyValue = (col, key) => {
  if (!col.filter.value || typeof col.filter.value !== 'object') {
    return ''
  }
  return col.filter.value[key] ?? ''
}

onMounted(() => {
  metadataStore.refreshFilterOptions()
})
</script>