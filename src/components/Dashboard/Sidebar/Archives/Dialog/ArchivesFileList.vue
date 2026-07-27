<template>
  <div class="w-full flex flex-col gap-3">
    <div v-if="fileStore.archives.length === 0" class="text-gray-400 text-center py-8 border border-dashed border-[#333] rounded-xl bg-[#1e1e1e]">
      No hay archivos en la lista.
    </div>

    <ArchivesFileCard
      v-for="archive in fileStore.archives"
      :key="archive.id"
      :archive="archive"
      @upload="handleUpload"
      @delete="handleDelete"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
/**
 * ArchivesFileList.vue
 * --------------------
 * Component that renders a list of ArchivesFileCard components based on the archives store state.
 *
 * This component reads the `archives` array from `useArchivesUploadStore` and iterates
 * over each item to render an `ArchivesFileCard`. It handles upload, delete, and cancel events.
 */

import { useArchivesUploadStore } from '@/stores/fileStore.js'
import ArchivesFileCard from './ArchivesFileCard.vue'

const fileStore = useArchivesUploadStore()

/**
 * Handles the upload action for a specific archive by calling the store upload method.
 * @param {string} id - The ID of the archive to upload.
 */
const handleUpload = (id) => {
  fileStore.uploadArchive(id)
}

/**
 * Handles the deletion/removal of a specific archive from the store list.
 * @param {string} id - The ID of the archive to remove.
 */
const handleDelete = (id) => {
  fileStore.removeArchive(id)
}

/**
 * Handles the cancellation of an ongoing archive processing or upload task.
 * @param {string} id - The ID of the archive to cancel.
 */
const handleCancel = (id) => {
  fileStore.cancelArchive(id)
}
</script>
