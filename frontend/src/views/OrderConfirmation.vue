<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.query.orderId || 'Desconocido';
</script>

<template>
  <div class="max-w-md mx-auto my-12 p-8 bg-white rounded-xl shadow border text-center">
    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
      ✓
    </div>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">¡Pedido Confirmado!</h1>
    <p class="text-gray-600 text-sm mb-4">
      Tu orden ha sido registrada atómicamente y el stock fue actualizado.
    </p>
    <div class="bg-gray-50 py-3 px-4 rounded-lg text-gray-800 font-mono text-sm mb-6 border">
      Orden ID: <strong>#{{ orderId }}</strong>
    </div>
    <div class="flex flex-col gap-2">
      <router-link to="/orders" class="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
        Ver mis pedidos (RF-06)
      </router-link>
      <router-link to="/catalog" class="text-blue-600 hover:underline text-sm py-1">
        Volver a la tienda
      </router-link>
    </div>
  </div>
</template>