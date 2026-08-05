<template>
  <div class="h-full flex flex-col gap-3 w-full max-w-xs">
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

    <fieldset class="border border-[#333333] rounded-xl p-2 bg-[#1e1e1e] text-gray-100 shadow-lg flex-1 flex flex-col w-full min-h-0">
      <legend class="px-2 text-xs font-semibold text-gray-300">
        {{ activeTab === 'archives' ? archivesTitle : 'Filtros' }}
      </legend>

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

    <ArchivesUploadingDialog v-model:visible="isUploadDialogOpen" />

    <Menu ref="archiveMenuRef" :model="archiveMenuOptions" :popup="true" class="!bg-[#1e1e1e] !border !border-[#333333] !rounded-xl !shadow-xl !p-1 text-xs" />
  </div>
</template>

<script setup>
/**
 * ArchivesPanel.vue
 * -----------------
 * Component acting as the main sidebar container for dashboard actions, archives list, and metadata filters.
 *
 * This component provides action buttons (Upload, Export) and a tabbed body section
 * that allows switching between `ArchivesList` and `MetadataFilters`. When an archive item is selected in `ArchivesList`,
 * `handleSelectArchive` opens a popup menu with the "Eliminar" option, which executes the archive deletion logic when clicked..
 */

import { ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import ExportButton from './ExportButton.vue'
import ArchivesList from './Archives/ArchivesList.vue'
import ArchivesUploadingDialog from './Archives/Dialog/ArchivesUploadingDialog.vue'
import MetadataFilters from '@/components/Dashboard/Sidebar/MetadataFilters.vue'
import { deleteArchive } from '@/services/Archives/archivesService.js'
import { useMetadataStore } from '@/stores/metadataStore.js'
import { useAppStore } from '@/stores/appStore.js'

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
const metadataStore = useMetadataStore()
const appStore = useAppStore()

// Controls which tab is active in the sidebar body ('archives' by default)
const activeTab = ref('archives')

// References and state for selected archive options menu
const archiveMenuRef = ref(null)
const selectedArchiveItem = ref(null)

// Menu items model containing the "Eliminar" option
const archiveMenuOptions = ref([
  {
    label: 'Eliminar',
    icon: 'pi pi-trash',
    class: 'text-red-400 font-medium hover:bg-red-500/10 rounded-lg',
    command: async () => {
      if (selectedArchiveItem.value) {
        await executeDeleteArchive(selectedArchiveItem.value)
      }
    }
  }
])

/**
 * Changes the active sidebar view tab between ArchivesList and MetadataFilters.
 *
 * Updates the `activeTab` reactive reference to switch the displayed component
 * in the sidebar container. Accepts either 'archives' or 'filters'.
 *
 * @param {string} tabName - The name of the tab to activate ('archives' | 'filters').
 */
const setActiveTab = (tabName) => {
  activeTab.value = tabName
}

/**
 * Opens the file uploading dialog and emits update-data event.
 *
 * Sets isUploadDialogOpen to true and emits the 'update-data' event to notify parent components.
 */
const openUploadDialog = () => {
  isUploadDialogOpen.value = true
  emit('update-data')
}

/**
 * Handles the excel export event triggered by the ExportButton.
 *
 * Emits the 'export-excel' event to initiate data export to Excel format.
 */
const handleExportExcel = () => {
  emit('export-excel')
}

/**
 * Opens the contextual menu showing the "Eliminar" option for the clicked archive item.
 *
 * Saves the selected archive item payload and opens the PrimeVue Menu overlay showing the "Eliminar" option.
 *
 * @param {Object} item - The selected archive object.
 * @param {Event} [event] - The DOM click event target.
 */
const handleSelectArchive = (item, event) => {
  selectedArchiveItem.value = item
  if (archiveMenuRef.value) {
    archiveMenuRef.value.toggle(event)
  }
}

/**
 * Executes the archive deletion process and refreshes store data.
 *
 * Calls deleteArchive API service with the archive ID, then refreshes appStore archives and fetches updated metadata in metadataStore.
 *
 * @param {Object} item - The archive object to be deleted.
 */
const executeDeleteArchive = async (item) => {
  await deleteArchive(item.id)
  appStore.refreshArchives()
  metadataStore.fetchMetadata()
}
</script>