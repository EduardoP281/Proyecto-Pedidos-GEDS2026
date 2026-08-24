<script setup>
import { useAuthStore } from './stores/auth'; // Verifica que esta ruta a tu store sea la correcta
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- BARRA DE NAVEGACIÓN GLOBAL -->
    <nav class="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      
      <!-- Lado Izquierdo: Logo y Menús -->
      <div class="flex items-center space-x-4">
        <router-link to="/" class="font-bold text-xl mr-6">App Pedidos</router-link>
        
        <!-- Si el usuario NO ha iniciado sesión -->
        <template v-if="!authStore.token">
          <router-link to="/login" class="hover:text-gray-300">Iniciar Sesión</router-link>
          <router-link to="/register" class="hover:text-gray-300">Registrarse</router-link>
        </template>

        <!-- Si el usuario SÍ ha iniciado sesión -->
        <template v-if="authStore.token">
          
          <!-- Vista: CLIENTE (role_id 1) -->
          <template v-if="authStore.user?.role_id === 1">
            <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">Rol: CLIENTE</span>
            <router-link to="/dashboard" class="hover:text-gray-300">Mis Pedidos</router-link>
          </template>

          <!-- Vista: ADMINISTRADOR (role_id 2) -->
          <template v-if="authStore.user?.role_id === 2">
            <span class="bg-purple-600 text-xs font-bold px-2 py-1 rounded">Rol: ADMIN</span>
            <router-link to="/dashboard" class="hover:text-gray-300">Panel de Control</router-link>
          </template>

          <!-- Vista: REPARTIDOR (role_id 3) -->
          <template v-if="authStore.user?.role_id === 3">
            <span class="bg-green-600 text-xs font-bold px-2 py-1 rounded">Rol: REPARTIDOR</span>
            <router-link to="/dashboard" class="hover:text-gray-300">Entregas Pendientes</router-link>
          </template>

        </template>
      </div>

      <!-- Lado Derecho: Usuario y Salida -->
      <div v-if="authStore.token" class="flex items-center space-x-4">
        <span class="text-sm">Hola, <strong>{{ authStore.user?.full_name }}</strong></span>
        <button @click="authStore.logout()" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-semibold transition-colors">
          Salir
        </button>
      </div>

    </nav>

    <!-- EL CONTENIDO DE LAS PÁGINAS (Dashboard, Login, etc.) -->
    <main class="p-6">
      <router-view></router-view>
    </main>
  </div>
</template>