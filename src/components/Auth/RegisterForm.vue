<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-[#252526] border border-[#333333] rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-100 tracking-tight">Registrarse</h2>
        <p class="text-sm text-gray-400 mt-2">Crea una cuenta para comenzar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Nombre Completo
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Juan Pérez"
            required
            class="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

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
            minlength="8"
            class="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
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
          <span>{{ loading ? 'Registrando...' : 'Registrarse' }}</span>
        </button>

        <div class="text-center text-sm text-gray-400 mt-4">
            ¿Ya tienes cuenta?

            <RouterLink
                :to="{ name: 'login' }"
                class="text-blue-500 hover:text-blue-400 transition-colors"
            >
                Inicia sesión
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
const { register } = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errorMessage = ref('')

/**
 * Validates the registration form inputs and connects to the API to create the user.
 */
const handleSubmit = async () => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    errorMessage.value = 'Por favor, rellena todos los campos.'
    return
  }
  
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }
  
  try {
    loading.value = true
    errorMessage.value = ''
    const data = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>