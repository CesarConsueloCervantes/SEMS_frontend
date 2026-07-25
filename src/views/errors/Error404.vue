<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigates the user back to the primary dashboard view.
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Página No Encontrada</h1>
      <p class="error-msg">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      
      <Button 
        label="Volver al Panel" 
        icon="pi pi-home" 
        class="p-button-outlined home-btn" 
        @click="goHome"
      />
    </div>
  </div>
</template>