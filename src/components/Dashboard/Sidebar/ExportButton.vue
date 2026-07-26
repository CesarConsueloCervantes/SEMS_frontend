<template>
  <Button
    type="button"
    @click="handleExport"
    class="w-full bg-[#2d2d2d]! hover:bg-[#383838]! border-[#404040]! text-emerald-500! font-semibold! py-2! px-3! rounded-lg! transition-colors flex items-center justify-center cursor-pointer text-sm"
  >
    <span>Exportar a Excel</span>
  </Button>
</template>

<script setup>
import Button from 'primevue/button'

const emit = defineEmits(['export'])

/**
 * Triggers the export event when the user clicks the excel export button.
 */
const handleExport = () => {
  emit('export')
}
</script>