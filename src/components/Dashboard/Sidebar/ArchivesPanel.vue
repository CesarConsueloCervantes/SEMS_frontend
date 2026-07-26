<template>
  <div class="h-full flex flex-col gap-3 w-full max-w-xs">
    <!-- Zone 1: Top options section -->
    <fieldset class="border border-[#333333] rounded-xl p-3 bg-[#1e1e1e] text-gray-100 shadow-lg w-full">
      <legend class="px-2 text-xs font-semibold text-gray-300">
        {{ title }}
      </legend>

      <div class="flex flex-col gap-2.5">
        <Button
          type="button"
          @click="handleUpdateData"
          class="w-full bg-[#2d2d2d]! hover:bg-[#383838]! border-[#404040]! text-white! font-bold! py-2! px-3! rounded-lg! transition-colors flex items-center justify-center cursor-pointer text-sm"
        >
          <span>Actualizar Datos</span>
        </Button>

        <Button
          type="button"
          @click="handleResetFilters"
          class="w-full bg-[#2d2d2d]! hover:bg-[#383838]! border-[#404040]! text-gray-300! font-normal! py-2! px-3! rounded-lg! transition-colors flex items-center justify-center cursor-pointer text-sm"
        >
          <span>Reiniciar Filtros</span>
        </Button>

        <!-- Reusable ExportButton component -->
        <ExportButton @export="handleExportExcel" />
      </div>
    </fieldset>

    <!-- Zone 2: Bottom section consuming remaining vertical space with elements close to borders -->
    <fieldset class="border border-[#333333] rounded-xl p-2 bg-[#1e1e1e] text-gray-100 shadow-lg flex-1 flex flex-col w-full min-h-0">
      <legend class="px-2 text-xs font-semibold text-gray-300">
        {{ archivesTitle }}
      </legend>

      <div class="flex-1 flex flex-col gap-1.5 p-1 border border-[#2a2a2a] rounded-lg bg-[#141414] overflow-y-auto">
        <slot name="archives">
          <div v-if="archiveItems.length === 0" class="text-xs text-gray-500 text-center py-4">
            Sin elementos disponibles
          </div>
          <div
            v-for="(item, index) in archiveItems"
            :key="index"
            @click="handleSelectArchive(item)"
            class="p-1.5 bg-[#252526] hover:bg-[#2d2d2d] border border-[#333333] rounded cursor-pointer transition-colors text-xs text-gray-200 flex items-center justify-between"
          >
            <span class="truncate">{{ typeof item === 'object' ? item.name : item }}</span>
            <i class="pi pi-file text-gray-400 text-xs"></i>
          </div>
        </slot>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import ExportButton from './ExportButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Opciones'
  },
  archivesTitle: {
    type: String,
    default: 'Archivos'
  },
  archiveItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update-data',
  'reset-filters',
  'export-excel',
  'select-archive'
])

/**
 * Triggers the update data event when the user clicks the update button.
 */
const handleUpdateData = () => {
  emit('update-data')
}

/**
 * Triggers the reset filters event when the user clicks the reset filters button.
 */
const handleResetFilters = () => {
  emit('reset-filters')
}

/**
 * Handles the excel export event triggered by the ExportButton.
 */
const handleExportExcel = () => {
  emit('export-excel')
}

/**
 * Emits the select-archive event when an archive item from the list is clicked.
 */
const handleSelectArchive = (item) => {
  emit('select-archive', item)
}
</script>