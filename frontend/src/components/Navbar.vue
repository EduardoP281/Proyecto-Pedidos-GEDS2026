<script setup>
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
    <!-- Brand / Catálogo público -->
    <div class="flex items-center gap-6">
      <router-link to="/" class="text-xl font-black tracking-tight text-gray-900 flex items-center gap-2">
        <span class="material-symbols-outlined text-blue-600">local_shipping</span>
        GEDS Pedidos
      </router-link>

      <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
        Catálogo
      </router-link>
    </div>

    <!-- Contenedor derecho de navegación -->
    <div class="flex items-center gap-5">
      <!-- Icono del Carrito con Badge reactivo (Visible para todos) -->
      <router-link to="/cart" class="relative text-gray-700 hover:text-blue-600 transition p-1">
        <span class="material-symbols-outlined text-2xl">shopping_cart</span>
        <span
          v-if="cartStore.totalItemsCount > 0"
          class="absolute -top-1 -right-2 bg-red-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow"
        >
          {{ cartStore.totalItemsCount }}
        </span>
      </router-link>

      <!-- 1. Menú público (si no hay sesión activa) -->
      <div v-if="!authStore.token" class="flex items-center gap-3">
        <router-link
          to="/login"
          class="text-gray-700 hover:text-blue-600 font-medium text-sm px-3 py-1.5 transition"
        >
          Iniciar Sesión
        </router-link>
        <router-link
          to="/register"
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
        >
          Registro
        </router-link>
      </div>

      <!-- 2. Menú privado (si hay sesión activa) -->
      <div v-if="authStore.token" class="flex items-center gap-4">
        <!-- VISTA CLIENTE (role_id = 1) -->
        <template v-if="authStore.user?.role_id === 1">
          <span class="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
            CLIENTE
          </span>
          <router-link to="/orders" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition">
            Mis Pedidos
          </router-link>
        </template>

        <!-- VISTA ADMINISTRADOR (role_id = 2) -->
        <template v-if="authStore.user?.role_id === 2">
          <span class="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">
            ADMIN
          </span>
          <router-link to="/admin" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition">
            Productos
          </router-link>
          <router-link to="/admin/orders" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition">
            Monitoreo
          </router-link>
        </template>

        <!-- VISTA REPARTIDOR (role_id = 3) -->
        <template v-if="authStore.user?.role_id === 3">
          <span class="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
            REPARTIDOR
          </span>
          <router-link to="/admin/orders" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition">
            Entregas
          </router-link>
        </template>

        <button
          @click="authStore.logout()"
          class="text-red-600 hover:text-red-700 font-medium text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>