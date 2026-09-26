<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();
const showNavbar = computed(() => !['Login', 'Register'].includes(route.name));
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar v-if="showNavbar" />
    <main class="min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: Inter, sans-serif;
}
</style>
