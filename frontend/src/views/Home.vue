<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Bienvenido al Dashboard</h1>
    <p>Has iniciado sesión correctamente.</p>
    <button @click="authStore.logout(); $router.push('/login')" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
      Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>