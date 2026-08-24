<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <nav class="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      
      <div class="flex items-center space-x-4">
        <span class="font-bold text-xl mr-6">App Pedidos</span>
        
        <template v-if="authStore.token">
          
          <template v-if="authStore.user?.role_id === 1">
            <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">Rol: CLIENTE</span>
            <a href="#" class="hover:text-gray-300">Mis Pedidos</a>
          </template>

          <template v-if="authStore.user?.role_id === 2">
            <span class="bg-purple-600 text-xs font-bold px-2 py-1 rounded">Rol: ADMIN</span>
            <a href="#" class="hover:text-gray-300">Panel de Control</a>
          </template>

          <template v-if="authStore.user?.role_id === 3">
            <span class="bg-green-600 text-xs font-bold px-2 py-1 rounded">Rol: REPARTIDOR</span>
            <a href="#" class="hover:text-gray-300">Entregas Pendientes</a>
          </template>

        </template>
      </div>

      <div v-if="authStore.token" class="flex items-center space-x-4">
        <span class="text-sm">Hola, <strong>{{ authStore.user?.full_name }}</strong></span>
      </div>
    </nav>

    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
      <p class="text-gray-600 mt-2">Has iniciado sesión correctamente.</p>
      
      <button @click="authStore.logout(); $router.push('/login')" class="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>