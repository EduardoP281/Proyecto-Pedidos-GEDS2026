<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import api from './services/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Variables de estado
const isApiConnected = ref(true);
let pingInterval = null;

// Lógica de interfaz basada en la ruta actual
const showDashboard = computed(() => !['Login', 'Register'].includes(route.name));
const userRole = computed(() => authStore.user?.role_id ?? null);

// Generador de iniciales (AD, JD, etc.)
const userInitials = computed(() => {
  const name = authStore.user?.full_name || authStore.user?.email || 'U';
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'U';
});

const logout = () => {
  authStore.logout();
};

// Verificador de API
const checkApiStatus = async () => {
  try {
    const res = await api.get('/products');
    isApiConnected.value = res.status === 200;
  } catch (error) {
    isApiConnected.value = false;
  }
};

onMounted(() => {
  checkApiStatus();
  pingInterval = setInterval(checkApiStatus, 10000);
});

onUnmounted(() => {
  if (pingInterval) clearInterval(pingInterval);
});

// Función para alternar el menú Cliente/Admin en la cabecera (Solo visual)
const toggleRoleView = (viewPath) => {
  router.push(viewPath);
};
</script>

<template>
  <!-- Vistas de pantalla completa (Login/Registro) -->
  <div v-if="!showDashboard" class="min-h-screen bg-slate-50">
    <router-view />
  </div>

  <!-- Vistas envueltas en el Dashboard -->
  <div v-else class="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans">
    
    <!-- SIDEBAR (Menú Lateral) -->
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

        <div v-if="userRole === 2" class="px-4 mb-4">
          <button @click="router.push('/admin')" class="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <span class="material-symbols-outlined text-sm">add</span> Crear Producto
          </button>
        </div>

        <!-- Links de Navegación por Rol -->
        <nav class="px-3 space-y-1">
          <template v-if="userRole === 1 || !userRole">
            <router-link to="/catalog" class="nav-item">
              <span class="material-symbols-outlined text-lg">grid_view</span> Catálogo
            </router-link>
            <router-link to="/cart" class="nav-item">
              <span class="material-symbols-outlined text-lg">shopping_cart</span> Carrito
            </router-link>
            <router-link v-if="userRole === 1" to="/orders" class="nav-item">
              <span class="material-symbols-outlined text-lg">receipt_long</span> Mis pedidos
            </router-link>
            <router-link v-if="!userRole" to="/login" class="nav-item">
              <span class="material-symbols-outlined text-lg">login</span> Iniciar Sesión
            </router-link>
          </template>

          <template v-else-if="userRole === 2">
            <router-link to="/catalog" class="nav-item">
              <span class="material-symbols-outlined text-lg">grid_view</span> Catálogo
            </router-link>
            <router-link to="/admin" class="nav-item" :class="{'router-link-exact-active': route.path === '/admin'}">
              <span class="material-symbols-outlined text-lg">inventory_2</span> Inventario / Admin
            </router-link>
            <router-link to="/admin/orders" class="nav-item">
              <span class="material-symbols-outlined text-lg">receipt_long</span> Pedidos (Admin)
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Pie del Sidebar (Estado de DB) -->
      <div class="border-t border-slate-200 p-4">
        <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
          <span class="material-symbols-outlined text-lg">description</span> Documentación
        </a>
        <div class="mt-2 flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            Base de Datos
          </div>
          <span class="uppercase tracking-wider">{{ isApiConnected ? 'Online' : 'Offline' }}</span>
        </div>
      </div>
    </aside>

    <!-- ÁREA CENTRAL -->
    <div class="flex flex-1 flex-col overflow-hidden">
      
      <!-- HEADER (Barra Superior) -->
      <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm z-10">
        
        <!-- Pestañas de ruta actual -->
        <div class="flex items-center gap-6 text-sm font-medium text-slate-500">
          <router-link to="/catalog" class="flex items-center gap-2 hover:text-blue-600 transition" :class="{'text-blue-600 font-semibold': route.path === '/catalog' || route.path === '/'}">
            <span class="material-symbols-outlined text-lg">grid_view</span> Catálogo
          </router-link>
          <router-link v-if="userRole === 2" to="/admin" class="flex items-center gap-2 hover:text-blue-600 transition" :class="{'text-blue-600 font-semibold': route.path.includes('/admin')}">
            <span class="material-symbols-outlined text-lg">settings</span> Administración
          </router-link>
        </div>

        <!-- Controles Derechos -->
        <div class="flex items-center gap-4">
          <!-- Indicador API -->
          <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <span :class="isApiConnected ? 'bg-emerald-500' : 'bg-red-500'" class="h-2 w-2 rounded-full"></span>
            {{ isApiConnected ? 'API Conectada' : 'API Desconectada' }}
          </div>
          
          <button v-if="userRole === 2" @click="router.push('/admin')" class="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            + Nuevo Producto
          </button>

          <!-- Toggle de Vistas (Visual) - Solo visible para Admins -->
          <div v-if="userRole === 2" class="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button @click="toggleRoleView('/catalog')" :class="!route.path.includes('/admin') ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="rounded px-3 py-1 text-xs font-semibold transition">Cliente</button>
            <button @click="toggleRoleView('/admin')" :class="route.path.includes('/admin') ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="rounded px-3 py-1 text-xs font-semibold transition">Admin</button>
          </div>

          <!-- Usuario y Perfil -->
          <div class="flex items-center gap-3 border-l border-slate-200 pl-4 text-slate-500">
            <button v-if="userRole === 1" @click="router.push('/cart')" class="hover:text-blue-600 transition"><span class="material-symbols-outlined">shopping_cart</span></button>
            <div class="flex items-center gap-2 group cursor-pointer" @click="logout" title="Cerrar sesión">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 group-hover:bg-red-100 group-hover:text-red-600 transition">
                {{ userInitials }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- VISTA DINÁMICA -->
      <main class="flex-1 overflow-auto p-6 relative">
        <router-view />

        <!-- Alerta Offline -->
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-10 opacity-0">
          <div v-if="!isApiConnected" class="fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg z-50">
            <span class="material-symbols-outlined text-red-500">warning</span>
            Modo Offline: Verifique su conexión
          </div>
        </transition>
      </main>

    </div>
  </div>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f1f5f9;
}

/* Vue-router asigna automáticamente esta clase al link activo */
.router-link-exact-active {
  background: #eff6ff;
  color: #2563eb;
}

.router-link-exact-active .material-symbols-outlined {
  color: #2563eb;
}
</style>