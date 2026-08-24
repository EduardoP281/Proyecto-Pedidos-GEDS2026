<script setup>
import { useAuthStore } from '@/stores/auth'; 
const authStore = useAuthStore();
</script>

<template>
<nav>
  <!-- Menú público (si no hay sesión activa) -->
  <div v-if="!authStore.token">
    <router-link to="/login">Iniciar Sesión</router-link>
    <router-link to="/register">Registro</router-link>
  </div>

  <!-- Menú privado (si hay sesión activa) -->
  <div v-if="authStore.token">
    
    <!-- 1. Vista para CLIENTE (asumiendo que role_id = 1) -->
    <template v-if="authStore.user?.role_id === 1">
      <span class="badge">Rol: CLIENTE</span>
      <router-link to="/mis-pedidos">Mis Pedidos</router-link>
      <router-link to="/nuevo-pedido">Hacer Pedido</router-link>
    </template>

    <!-- 2. Vista para ADMINISTRADOR (asumiendo que role_id = 2) -->
    <template v-if="authStore.user?.role_id === 2">
      <span class="badge">Rol: ADMINISTRADOR</span>
      <router-link to="/panel-control">Panel de Control</router-link>
      <router-link to="/gestionar-usuarios">Usuarios</router-link>
    </template>

    <!-- 3. Vista para REPARTIDOR (asumiendo que role_id = 3) -->
    <template v-if="authStore.user?.role_id === 3">
      <span class="badge">Rol: REPARTIDOR</span>
      <router-link to="/entregas-pendientes">Entregas Pendientes</router-link>
      <router-link to="/historial-entregas">Historial</router-link>
    </template>

    <!-- Botón de cierre de sesión para cualquier rol -->
    <button @click="authStore.logout()">Cerrar Sesión</button>
  </div>
</nav>
</template>