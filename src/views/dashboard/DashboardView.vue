<template>
  <div class="h-screen flex flex-col bg-[#1e1e1e] text-gray-100">
    <header class="w-full h-10 bg-[#252526] border-b border-[#333333] px-4 py-1.5 flex justify-between items-center sticky top-0 z-20 shadow-sm">
      <h1 class="text-sm font-bold tracking-wide text-gray-100">SEMS Dashboard</h1>

      <button
        @click="handleLogout"
        :disabled="loading"
        class="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-medium rounded-full shadow-sm hover:shadow-red-600/30 transition-all duration-150 flex items-center justify-center cursor-pointer text-xs"
      >
        <span v-if="loading" class="animate-spin mr-1.5 h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
        <span>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
      </button>
    </header>

    <div class="flex flex-1 relative overflow-hidden">
      <main class="flex-1 mr-80 overflow-hidden">
        <MetadataTable />
      </main>

      <aside class="w-80 border-l border-[#333333] bg-[#1e1e1e] p-3 fixed right-0 top-10 bottom-0 overflow-hidden z-10 flex justify-center items-stretch">
        <ArchivesPanel />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ArchivesPanel from '@/components/Dashboard/Sidebar/ArchivesPanel.vue'
import MetadataTable from '@/components/Dashboard/Metadata/MetadataTable.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

/**
 * Handles the user logout process by invoking the auth store logout action and navigating back to the login page.
 */
const handleLogout = async () => {
  try {
    loading.value = true
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    loading.value = false
  }
}
</script>