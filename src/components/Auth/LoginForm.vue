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

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center cursor-pointer"
        >
          <span v-if="loading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

/**
 * Validates form input fields and emits the submit event containing the email and password payload.
 */
const handleSubmit = () => {
  if (!email.value || !password.value) {
    alert('Por favor, rellena todos los campos.')
    return
  }
  
  emit('submit', {
    email: email.value,
    password: password.value
  })
}
</script>