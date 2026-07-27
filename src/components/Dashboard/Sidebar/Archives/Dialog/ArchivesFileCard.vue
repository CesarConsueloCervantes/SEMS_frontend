<template>
  <div class="border border-[#333] rounded-xl p-4 bg-[#1e1e1e] text-gray-100 shadow-lg mb-4">
    <div class="flex items-center justify-between mb-2">
      <div class="flex flex-col">
        <span class="font-medium text-lg truncate" :title="archive.name">{{ archive.name }}</span>
        <span class="text-sm text-gray-400">{{ formattedSize }}</span>
      </div>
      
      <div class="flex space-x-2">
        <button v-if="canUpload" @click="emitUpload" class="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors">
        Subir
        </button>
        <button v-if="canDelete" @click="emitDelete" class="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors">
          Eliminar
        </button>
        <button v-if="canCancel" @click="emitCancel" class="text-gray-400 hover:text-gray-200">
          <i class="pi pi-times"></i>
          Cancelar
        </button>
      </div>
    </div>

    <div v-if="archive.message && archive.message.length" class="mt-2 text-sm text-red-400">
      {{ archive.message }}
    </div>
  </div>
</template>

<script setup>
/**
 * Displays a card with information about a file being uploaded, and provides
 * action buttons (Upload, Delete, Cancel) with appropriate enable/disable logic.
 */

import { computed } from 'vue'
import { ArchiveUploadStatus } from '@/stores/fileStore.js'
// PrimeVue Button import removed – using native button element with Tailwind

// Props definition
const props = defineProps({
  /**
   * Archive object coming from the store.
   * Expected shape: { id, name, size, status, message, processCanceled }
   */
  archive: {
    type: Object,
    required: true
  }
})

// Emit events for parent handling
const emit = defineEmits(['upload', 'delete', 'cancel'])

// Human‑readable size (bytes -> KB/MB)
const formattedSize = computed(() => {
  const bytes = props.archive.size ?? 0
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
})

// Button enable/disable logic
const canUpload = computed(() =>
  props.archive.status === ArchiveUploadStatus.READY_TO_UPLOAD &&
  !props.archive.processCanceled
)

const canDelete = computed(() => {
  const s = props.archive.status
  return (
    s === ArchiveUploadStatus.INVALID_STRUCTURE ||
    s === ArchiveUploadStatus.DUPLICATED ||
    s === ArchiveUploadStatus.ERROR ||
    s === ArchiveUploadStatus.READY_TO_UPLOAD ||
    s === ArchiveUploadStatus.CANCELED
  )
})

const canCancel = computed(() =>
  !props.archive.processCanceled &&
  props.archive.status !== ArchiveUploadStatus.READY_TO_UPLOAD &&
  props.archive.status !== ArchiveUploadStatus.CANCELED
)

// Emit helper functions
function emitUpload() {
  emit('upload', props.archive.id)
}
function emitDelete() {
  emit('delete', props.archive.id)
}
function emitCancel() {
  emit('cancel', props.archive.id)
}
</script>
