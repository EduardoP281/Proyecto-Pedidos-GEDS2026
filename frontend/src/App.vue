<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showDashboard = computed(() => !['Login', 'Register'].includes(route.name));
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
          <router-link to="/" class="nav-item">Panel Principal</router-link>
          <router-link to="/catalog" class="nav-item active">Catálogo</router-link>
          <router-link to="/admin" class="nav-item">Inventario</router-link>
          <router-link to="/admin" class="nav-item">Categorías</router-link>
          <router-link to="/admin/orders" class="nav-item">Pedidos</router-link>
          <router-link to="/orders" class="nav-item">Rendimiento</router-link>
        </nav>

        <div class="border-t border-slate-200 p-4 text-xs text-slate-500">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-sm">description</span>
            <span>Documentación</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-slate-400"></span> Base de Datos</span>
            <span>offline</span>
          </div>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6">
          <div class="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span>API Desconectada</span>
          </div>

          <div class="flex items-center gap-4">
            <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              + Nuevo Producto
            </button>
            <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <span class="text-sm text-slate-600">Cliente</span>
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">AD</div>
            </div>
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
