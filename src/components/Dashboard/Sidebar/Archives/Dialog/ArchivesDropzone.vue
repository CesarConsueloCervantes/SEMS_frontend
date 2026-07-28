<template>
  <div
    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-3"
    :class="[
      isDragging
        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
        : 'border-[#404040] bg-[#1e1e1e] hover:border-emerald-500/60 hover:bg-[#252526] text-gray-300'
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <!-- Hidden file input element -->
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Upload icon -->
    <i class="pi pi-cloud-upload text-4xl text-emerald-500"></i>

    <!-- Instructions text -->
    <div class="flex flex-col gap-1">
      <p class="font-medium text-sm text-gray-200">
        Arrastra y suelta tus archivos aquí, o <span class="text-emerald-400 underline">haz clic para buscar</span>
      </p>
      <p class="text-xs text-gray-400">
        Formatos soportados: .txt, .csv
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * ArchivesDropzone.vue
 * --------------------
 * Component that provides a drag-and-drop zone and file picker for selecting files to upload.
 *
 * English: This component handles drag over, drag leave, file drop, and file input selection.
 * Selected files are converted into an array and passed to the `addArchives` action of `useArchivesUploadStore`.
 *
 * Español: Zona para soltar o seleccionar archivos. Envía los archivos seleccionados al store `fileStore.js`.
 */

import { ref } from 'vue'
import { useArchivesUploadStore } from '@/stores/fileStore.js'

const fileStore = useArchivesUploadStore()
const fileInput = ref(null)
const isDragging = ref(false)

/**
 * Handles the drag over event to indicate active drag state.
 * En español: Cambia el estado a dragging cuando el usuario arrastra archivos sobre la zona.
 * @param {DragEvent} event - The drag over event.
 */
const handleDragOver = (event) => {
  isDragging.value = true
}

/**
 * Handles the drag leave event to reset the active drag state.
 * En español: Restablece el estado cuando el usuario saca los archivos de la zona.
 * @param {DragEvent} event - The drag leave event.
 */
const handleDragLeave = (event) => {
  isDragging.value = false
}

/**
 * Handles the file drop event, extracts dropped files, and passes them to the store.
 * En español: Recibe los archivos arrastrados y los envía a addArchives en el store.
 * @param {DragEvent} event - The drop event containing dataTransfer files.
 */
const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    fileStore.addArchives(files)
  }
}

/**
 * Triggers the click event on the hidden file input element.
 * En español: Abre la ventana de selección de archivos al hacer clic en la zona.
 */
const triggerFileInput = () => {
  fileInput.value?.click()
}

/**
 * Handles the change event from the hidden file input element and passes selected files to the store.
 * En español: Procesa los archivos elegidos desde la ventana exploradora y los manda a addArchives.
 * @param {Event} event - The input change event containing selected files.
 */
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length > 0) {
    fileStore.addArchives(files)
  }
  if (event.target) {
    event.target.value = ''
  }
}
</script>