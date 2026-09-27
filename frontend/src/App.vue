<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showDashboard = computed(() => !['Login', 'Register'].includes(route.name));
const userRole = computed(() => authStore.user?.role_id ?? null);
const userInitials = computed(() => {
  const name = authStore.user?.full_name || authStore.user?.email || 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';
});

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div v-if="!showDashboard" class="min-h-screen bg-slate-50">
    <router-view />
  </div>

  <div v-else class="min-h-screen bg-slate-100 text-slate-700">
    <div class="flex h-screen overflow-hidden">
      <aside class="w-72 border-r border-slate-200 bg-white/95 backdrop-blur-sm flex flex-col">
        <div class="px-5 py-5 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <span class="material-symbols-outlined text-lg">inventory_2</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-800">Pedidos</h1>
            </div>
          </div>
        </div>

        <nav class="flex-1 space-y-1 p-4">
          <template v-if="userRole === 1">
            <router-link to="/catalog" class="nav-item active">Catálogo</router-link>
            <router-link to="/cart" class="nav-item">Carrito</router-link>
            <router-link to="/orders" class="nav-item">Mis pedidos</router-link>
          </template>

          <template v-else-if="userRole === 2">
            <router-link to="/admin" class="nav-item">Inventario</router-link>
            <router-link to="/admin" class="nav-item">Categorías</router-link>
            <router-link to="/admin/orders" class="nav-item">Pedidos</router-link>
          </template>

          <template v-else-if="userRole === 3">
            <router-link to="/admin/orders" class="nav-item active">Entregas</router-link>
            <router-link to="/orders" class="nav-item">Rendimiento</router-link>
          </template>

          <template v-else>
            <router-link to="/catalog" class="nav-item active">Catálogo</router-link>
            <router-link to="/login" class="nav-item">Iniciar sesión</router-link>
          </template>
        </nav>

        <div class="border-t border-slate-200 p-4 text-xs text-slate-500">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-sm">description</span>
            <span>Documentación</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-slate-400"></span> Base de Datos</span>
            <span>online</span>
          </div>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6">
          <div class="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span>{{ userRole === 2 ? 'Modo administrador' : userRole === 3 ? 'Modo repartidor' : 'Modo cliente' }}</span>
          </div>

          <div class="flex items-center gap-4">
            <button @click="router.push(userRole === 2 ? '/admin' : userRole === 3 ? '/admin/orders' : '/catalog')" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              {{ userRole === 2 ? '+ Nuevo producto' : userRole === 3 ? 'Ver entregas' : 'Ver catálogo' }}
            </button>
            <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <span class="text-sm text-slate-600">{{ authStore.user?.full_name || authStore.user?.email || 'Usuario' }}</span>
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">{{ userInitials }}</div>
            </div>
            <button @click="logout" class="text-sm font-medium text-red-600 hover:text-red-700">Salir</button>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.96rem;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: #eef3ff;
  color: #1d4ed8;
}
</style>
