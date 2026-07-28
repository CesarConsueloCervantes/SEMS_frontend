<template>
  <Dialog
    :visible="visible"
    @update:visible="handleVisibilityChange"
    @hide="refreshData()"
    modal
    header="Carga de Archivos"
    :draggable="false"
    :style="{ width: '90vw', height: '200vh', maxWidth: 'none' }"
    :breakpoints="{
      '1200px': '80vw',
      '768px': '95vw'
    }"
    class="bg-[#1e1e1e] text-gray-100 rounded-xl overflow-hidden"
  >
    <div class="flex flex-col gap-4 p-4 h-[75vh]">
      <div v-if="hasArchives" class="max-h-87.5 overflow-y-auto pr-1">
        <ArchivesFileList />
      </div>

      <div :class="hasArchives ? 'transform scale-90 py-1' : 'w-full'">
        <ArchivesDropzone />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
/**
 * ArchivesUploadingDialog.vue
 * ---------------------------
 * Dialog component that houses ArchivesDropzone and ArchivesFileList components.
 *
 * This component acts as a modal dialog using PrimeVue Dialog. It conditionally displays
 * the ArchivesFileList component when archives exist in `useArchivesUploadStore`, and places
 * ArchivesDropzone at the bottom (rendered smaller when archives are present).
 */

import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useArchivesUploadStore } from '@/stores/fileStore.js'
import ArchivesDropzone from './ArchivesDropzone.vue'
import ArchivesFileList from './ArchivesFileList.vue'
import { useAppStore } from '@/stores/appStore.js'
import { useMetadataStore } from '@/stores/metadataStore.js'

const appStore = useAppStore()
const metadataStore = useMetadataStore()
// Props definition for controlling dialog visibility
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits declaration for updating dialog visibility binding
const emit = defineEmits(['update:visible'])

const fileStore = useArchivesUploadStore()

/**
 * Computed property to determine if there are archives present in the file store.
 * @returns {boolean} True if archives array has elements, false otherwise.
 */
const hasArchives = computed(() => {
  return fileStore.archives.length > 0
})

/**
 * Emits the updated visibility value to parent component.
 * @param {boolean} value - The new visibility state.
 */
const handleVisibilityChange = (value) => {
  emit('update:visible', value)
}

const refreshData = () => {
  appStore.refreshArchives()
  metadataStore.fetchMetadata()
}
</script>