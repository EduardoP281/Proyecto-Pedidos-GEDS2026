<script setup>
import { ref, onMounted } from 'vue'

const mensajeBackend = ref('Cargando mensaje del servidor...')

onMounted(async () => {
  try {
    // En desarrollo local, Vite usa el puerto 5173 y Node el 3000
    const response = await fetch('http://localhost:3000/api/test')
    const data = await response.json()
    mensajeBackend.value = data.message
  } catch (error) {
    mensajeBackend.value = 'Error al conectar con el backend. ¿Está encendido?'
    console.error(error)
  }
})
</script>

<template>
  <div class="container">
    <h1>🎓 App PROYECTO_PEDIDOS (Vue + Node)</h1>
    <div class="status-box">
      <p><strong>Estado del Backend:</strong> {{ mensajeBackend }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 50px;
}
.status-box {
  background-color: #f0f8ff;
  border: 1px solid #cce7ff;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 20px;
  color: #333;
}
</style>