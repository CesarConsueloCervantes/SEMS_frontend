<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-[#252526] border border-[#333333] rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-100 tracking-tight">Iniciar Sesión</h2>
        <p class="text-sm text-gray-400 mt-2">Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            class="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center cursor-pointer"
        >
          <span v-if="loading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
        </button>

        <div class="text-center text-sm text-gray-400 mt-4">
            ¿No tienes cuenta?

            <RouterLink
                :to="{ name: 'register' }"
                class="text-blue-500 hover:text-blue-400 transition-colors"
            >
                Regístrate
            </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const { login } = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

/**
 * Validates form input fields, connects to the API to authenticate, and emits a success event.
 */
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, rellena todos los campos.'
    return
  }
  
  try {
    loading.value = true
    errorMessage.value = ''
    const data = await login({
      email: email.value,
      password: password.value
    })

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
    router.push('/dashboard')
  }
}
</script>