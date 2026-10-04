<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const route = useRoute();

const isApiConnected = ref(true);
let pingInterval = null;

// Verifica si la API está respondiendo
const checkApiStatus = async () => {
  try {
    const res = await api.get('/products'); // Hacemos ping a una ruta segura
    isApiConnected.value = res.status === 200;
  } catch (error) {
    isApiConnected.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

onMounted(() => {
  checkApiStatus();
  pingInterval = setInterval(checkApiStatus, 10000); // Comprueba cada 10s
});

onUnmounted(() => {
  if (pingInterval) clearInterval(pingInterval);
});

// Resalta la pestaña "Admin" si la ruta es /admin o /monitoreo
const isAdminActive = computed(() => route.path === '/admin' || route.path === '/monitoreo');
</script>

<template>
  <div class="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans">
    
    <!-- BARRA LATERAL (Sidebar) -->
    <aside class="w-64 flex flex-col justify-between border-r border-slate-200 bg-white shadow-sm z-10">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
            <span class="material-symbols-outlined text-xl">storefront</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight">Pedidos</h1>
        </div>

        <!-- Usuario -->
        <div class="px-6 py-5 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <span class="material-symbols-outlined">dashboard</span>
          </div>
          <div class="leading-tight">
            <p class="text-sm font-semibold text-slate-800">Panel Principal</p>
            <p class="text-xs text-slate-500">Gestión de Tienda</p>
          </div>
        </div>

        <div class="px-4 mb-4">
          <button @click="router.push('/admin')" class="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <span class="material-symbols-outlined text-sm">add</span> Crear Producto
          </button>
        </div>

        <!-- Links de Navegación -->
        <nav class="px-3 space-y-1">
          <router-link to="/catalogo" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors" :class="route.path === '/catalogo' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'">
            <span class="material-symbols-outlined text-lg">grid_view</span> Catálogo
          </router-link>
          
          <router-link to="/admin" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors" :class="route.path === '/admin' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'">
            <span class="material-symbols-outlined text-lg">inventory_2</span> Inventario / Admin
          </router-link>

          <router-link to="/carrito" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors" :class="route.path === '/carrito' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'">
            <span class="material-symbols-outlined text-lg">shopping_cart</span> Carrito
          </router-link>
        </nav>
      </div>

      <!-- Pie del Sidebar -->
      <div class="border-t border-slate-200 p-4">
        <div class="mb-3 flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            Base de Datos
          </div>
          <span class="uppercase tracking-wider">{{ isApiConnected ? 'Online' : 'Offline' }}</span>
        </div>
        <button @click="logout" class="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
          <span class="material-symbols-outlined text-lg">logout</span> Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- ÁREA CENTRAL -->
    <div class="flex flex-1 flex-col overflow-hidden">
      
      <!-- BARRA SUPERIOR (Header) -->
      <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm z-10">
        
        <!-- Pestañas Superiores -->
        <div class="flex items-center gap-6 text-sm font-medium text-slate-500">
          <router-link to="/catalogo" class="flex items-center gap-2 hover:text-blue-600 transition" :class="{'text-blue-600': route.path === '/catalogo'}">
            <span class="material-symbols-outlined text-lg">grid_view</span> Catálogo
          </router-link>
          <router-link to="/admin" class="flex items-center gap-2 hover:text-blue-600 transition" :class="{'text-blue-600': route.path === '/admin'}">
            <span class="material-symbols-outlined text-lg">settings</span> Administración
          </router-link>
        </div>

        <!-- Controles Derechos -->
        <div class="flex items-center gap-4">
          <!-- Indicador API[cite: 11] -->
          <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="h-2 w-2 rounded-full"></span>
            {{ isApiConnected ? 'API Conectada' : 'API Desconectada' }}
          </div>
          
          <button @click="router.push('/admin')" class="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            + Nuevo Producto
          </button>

          <!-- Toggle Visual -->
          <div class="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button @click="router.push('/catalogo')" :class="!isAdminActive ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="rounded px-3 py-1 text-xs font-semibold transition">Cliente</button>
            <button @click="router.push('/admin')" :class="isAdminActive ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="rounded px-3 py-1 text-xs font-semibold transition">Admin</button>
          </div>

          <div class="flex items-center gap-3 border-l border-slate-200 pl-4 text-slate-500">
            <button @click="router.push('/carrito')" class="hover:text-blue-600 transition"><span class="material-symbols-outlined">shopping_cart</span></button>
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">AD</div>
          </div>
        </div>
      </header>

      <!-- VISTA DINÁMICA (Aquí se inserta el código de AdminPanel.vue o Catalog.vue) -->
      <main class="flex-1 overflow-auto p-6 relative">
        <router-view />

        <!-- Alerta Offline -->
        <div v-if="!isApiConnected" class="fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg z-50">
          <span class="material-symbols-outlined text-red-500">warning</span>
          Modo Offline: Verifique su conexión
        </div>
      </main>

    </div>
  </div>
</template>