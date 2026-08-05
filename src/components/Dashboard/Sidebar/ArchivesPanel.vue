<template>
  <div class="h-full flex flex-col gap-3 w-full max-w-xs">
    <!-- Top options fieldset -->
    <fieldset class="border border-[#333333] rounded-xl p-3 bg-[#1e1e1e] text-gray-100 shadow-lg w-full">
      <legend class="px-2 text-xs font-semibold text-gray-300">
        {{ title }}
      </legend>

      <div class="flex flex-col gap-2.5">
        <Button
          type="button"
          @click="openUploadDialog"
          class="w-full bg-[#2d2d2d]! hover:bg-[#383838]! border-[#404040]! text-white! font-bold! py-2! px-3! rounded-lg! transition-colors flex items-center justify-center cursor-pointer text-sm"
        >
          <span class="flex items-center justify-center gap-2">
            Subir Archivos
            <i class="pi pi-plus-circle"></i>
          </span>
        </Button>

        <ExportButton @export="handleExportExcel" />
      </div>
    </fieldset>

    <!-- Main dynamic panel fieldset with tab selector for Archives and Filters -->
    <fieldset class="border border-[#333333] rounded-xl p-2 bg-[#1e1e1e] text-gray-100 shadow-lg flex-1 flex flex-col w-full min-h-0">
      <legend class="px-2 text-xs font-semibold text-gray-300">
        {{ activeTab === 'archives' ? archivesTitle : 'Filtros' }}
      </legend>

      <!-- Selector tab buttons to switch between ArchivesList and MetadataFilters -->
      <div class="flex gap-1 mb-2 border-b border-[#333333] pb-2">
        <button
          type="button"
          @click="setActiveTab('archives')"
          :class="[
            'flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center',
            activeTab === 'archives'
              ? 'bg-[#2d2d2d] text-white font-bold border border-[#404040] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#252526]'
          ]"
        >
          Archivos
        </button>

        <button
          type="button"
          @click="setActiveTab('filters')"
          :class="[
            'flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center',
            activeTab === 'filters'
              ? 'bg-[#2d2d2d] text-white font-bold border border-[#404040] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#252526]'
          ]"
        >
          Filtros
        </button>
      </div>

      <!-- Container displaying either ArchivesList or MetadataFilters in the same space -->
      <div class="flex-1 overflow-y-auto pr-1 min-h-0">
        <div v-if="activeTab === 'archives'" class="h-full">
          <slot name="archives">
            <ArchivesList @select-archive="handleSelectArchive" />
          </slot>
        </div>
        <div v-else-if="activeTab === 'filters'" class="h-full">
          <slot name="filters">
            <MetadataFilters />
          </slot>
        </div>
      </div>
    </fieldset>

    <!-- Dialog for uploading archives -->
    <ArchivesUploadingDialog v-model:visible="isUploadDialogOpen" />
  </div>
</template>

<script setup>
/**
 * ArchivesPanel.vue
 * -----------------
 * Component acting as the main sidebar container for dashboard actions, archives list, and metadata filters.
 *
 * English: This component provides action buttons (Upload, Reset Filters, Export) and a tabbed body
 * section that allows switching between `ArchivesList` and `MetadataFilters` in the same visual area.
 * By default, `ArchivesList` is selected and displayed first.
 *
 * Español: Componente contenedor del panel lateral que permite alternar entre la lista de archivos
 * y los filtros de metadatos en el mismo espacio, mostrando por defecto la lista de archivos.
 */

import { ref } from 'vue'
import Button from 'primevue/button'
import ExportButton from './ExportButton.vue'
import ArchivesList from './Archives/ArchivesList.vue'
import ArchivesUploadingDialog from './Archives/Dialog/ArchivesUploadingDialog.vue'
import MetadataFilters from '@/components/Dashboard/Sidebar/MetadataFilters.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Opciones'
  },
  archivesTitle: {
    type: String,
    default: 'Archivos'
  }
})

const emit = defineEmits([
  'update-data',
  'reset-filters',
  'export-excel',
  'select-archive'
])

// Controls visibility state of the upload dialog
const isUploadDialogOpen = ref(false)

// Controls which tab is active in the sidebar body ('archives' by default)
const activeTab = ref('archives')

/**
 * Changes the active sidebar view tab between ArchivesList and MetadataFilters.
 *
 * English: Updates the `activeTab` reactive reference to switch the displayed component
 * in the sidebar container. Accepts either 'archives' or 'filters'.
 *
 * Español: Cambia la pestaña activa para mostrar el listado de archivos o los filtros de metadatos.
 *
 * @param {string} tabName - The name of the tab to activate ('archives' | 'filters').
 */
const setActiveTab = (tabName) => {
  activeTab.value = tabName
}

/**
 * Opens the file uploading dialog and emits update-data event.
 *
 * English: Sets isUploadDialogOpen to true and emits the 'update-data' event to notify parent components.
 *
 * Español: Abre el diálogo modal de carga de archivos y emite el evento update-data.
 */
const openUploadDialog = () => {
  isUploadDialogOpen.value = true
  emit('update-data')
}

/**
 * Triggers the reset filters event when the user clicks the reset filters button.
 *
 * English: Emits the 'reset-filters' event to notify parent components to clear active filter selections.
 *
 * Español: Emite el evento reset-filters al hacer clic en el botón de reiniciar filtros.
 */
const handleResetFilters = () => {
  emit('reset-filters')
}

/**
 * Handles the excel export event triggered by the ExportButton.
 *
 * English: Emits the 'export-excel' event to initiate data export to Excel format.
 *
 * Español: Emite el evento export-excel para iniciar la exportación de metadatos a Excel.
 */
const handleExportExcel = () => {
  emit('export-excel')
}

/**
 * Emits the select-archive event when an archive item from the list is clicked.
 *
 * English: Emits the 'select-archive' event with the selected archive object payload.
 *
 * Español: Emite el evento select-archive enviando la información del archivo seleccionado.
 *
 * @param {Object} item - The selected archive object.
 */
const handleSelectArchive = (item) => {
  emit('select-archive', item)
}
</script>