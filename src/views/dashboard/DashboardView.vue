<template>
  <div class="min-h-screen relative p-6">
    <!-- Logout button located in top right corner -->
    <div class="absolute top-4 right-4">
      <button
        @click="handleLogout"
        :disabled="loading"
        class="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-medium rounded-full shadow-md hover:shadow-red-600/30 transition-all duration-150 flex items-center justify-center cursor-pointer"
      >
        <span v-if="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
        <span>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
      </button>
    </div>

    <h1 class="text-2xl font-bold text-gray-100">Dashboard</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

/**
 * Handles the user logout flow by calling the auth store action and redirecting to the login view.
 * 
 * Llama a la función logout del authStore para finalizar la sesión del usuario y luego redirige al login.
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