<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();

// Oculta el Navbar si estamos en login o register
const showNavbar = computed(() => {
  return !['Login', 'Register'].includes(route.name);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <!-- Navbar global dinámico con roles y carrito -->
    <Navbar v-if="showNavbar" />

    <!-- Contenido dinámico de las rutas -->
    <main class="flex-grow">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Reseteo base */
body {
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
}
</style>