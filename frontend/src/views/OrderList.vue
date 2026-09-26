<script setup>
import { ref, onMounted } from 'vue';
import { ordersService } from '../services/orders';

const orders = ref([]);
const loading = ref(true);
const error = ref('');

const cargarPedidos = async () => {
  loading.value = true;
  try {
    const res = await ordersService.getMyOrders();
    orders.value = res.data;
  } catch (err) {
    error.value = err.message || 'Error al cargar los pedidos';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarPedidos);
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Mis Pedidos (RF-06)</h1>

    <div v-if="loading" class="text-center py-10 text-gray-500">Cargando tus órdenes...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="text-center py-12 bg-white rounded-xl border shadow">
      <p class="text-gray-500">Aún no has realizado pedidos.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="ord in orders" :key="ord.id" class="bg-white p-5 rounded-xl border shadow flex justify-between items-center">
        <div>
          <span class="text-xs font-bold text-gray-400">ORDEN #{{ ord.id }}</span>
          <p class="font-bold text-lg text-gray-900">${{ Number(ord.total).toFixed(2) }}</p>
          <span class="text-xs text-gray-500">Fecha: {{ new Date(ord.createdAt || Date.now()).toLocaleDateString() }}</span>
        </div>
        <div>
          <span class="px-3 py-1 rounded-full text-xs font-bold"
            :class="{
              'bg-yellow-100 text-yellow-800': ord.estado === 'CREADO',
              'bg-blue-100 text-blue-800': ord.estado === 'PAGADO',
              'bg-purple-100 text-purple-800': ord.estado === 'EN_PREPARACION',
              'bg-indigo-100 text-indigo-800': ord.estado === 'EN_CAMINO',
              'bg-green-100 text-green-800': ord.estado === 'ENTREGADO',
              'bg-red-100 text-red-800': ord.estado === 'CANCELADO',
            }">
            {{ ord.estado }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>