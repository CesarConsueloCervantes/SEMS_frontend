<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div v-if="loading" class="flex justify-center items-center py-4">
      <span class="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></span>
    </div>

    <div v-else-if="errorMessage" class="text-xs text-red-400 text-center py-2 px-1">
      {{ errorMessage }}
    </div>

    <div v-else-if="archives.length === 0" class="text-xs text-gray-500 text-center py-4">
      Sin archivos disponibles
    </div>

    <div
      v-else
      v-for="archive in archives"
      :key="archive.short_archive_hash"
      @click="handleSelect(archive)"
      class="p-2 bg-[#252526] hover:bg-[#2d2d2d] border border-[#333333] rounded-lg cursor-pointer transition-colors text-xs text-gray-200 flex flex-col gap-1 w-full overflow-hidden group"
    >
      <div class="flex items-start gap-1.5 w-full">
        <i class="pi pi-file text-emerald-500 text-xs shrink-0 mt-0.5"></i>

        <span
          class="flex-1 min-w-0 font-medium text-gray-200 group-hover:text-white break-words whitespace-normal"
          :title="archive.archive_name"
        >
          {{ archive.archive_name }}
        </span>
      </div>

      <!-- Hash y tamaño -->
      <div class="flex items-center justify-between text-[10px] text-gray-400 gap-2 w-full">
        <span
          class="truncate font-mono flex-1 min-w-0"
          :title="archive.short_archive_hash"
        >
          {{ archive.short_archive_hash }}
        </span>

        <span class="shrink-0 font-semibold">
          {{ archive.archive_size_bytes }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArchivesByUser } from '@/services/Archives/archivesService'

const archives = ref([])
const loading = ref(false)
const errorMessage = ref('')

const emit = defineEmits(['select-archive'])

/**
 * Fetches the list of processed archives for the logged in user asynchronously from the API service.
 */
const fetchArchives = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await getArchivesByUser()
    archives.value = Array.isArray(response) ? response : (response?.data || [])
  } catch (error) {
    console.error('Error fetching user archives:', error)
    errorMessage.value = 'No se pudieron cargar los archivos'
  } finally {
    loading.value = false
  }
}

/**
 * Handles selection of a single archive item from the list and emits the select-archive event.
 */
const handleSelect = (archive) => {
  emit('select-archive', archive)
}

onMounted(() => {
  fetchArchives()
})
</script>