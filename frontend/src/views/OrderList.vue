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
    // CORRECCIÓN: Accedemos al arreglo de datos dentro del Envelope Pattern
    orders.value = res.data?.data || res.data || [];
  } catch (err) {
    error.value = err.response?.data?.error?.message || err.message || 'Error al cargar los pedidos';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarPedidos);
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-slate-800 mb-6">Mis Pedidos (RF-06)</h1>

    <div v-if="loading" class="text-center py-10 text-slate-500">Cargando tus órdenes...</div>
    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
      <p class="text-slate-500">Aún no has realizado pedidos.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="ord in orders" :key="ord.id" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition">
        <div>
          <span class="text-xs font-bold text-slate-400">ORDEN #{{ ord.id }}</span>
          <p class="font-bold text-lg text-slate-900">${{ Number(ord.total).toFixed(2) }}</p>
          <!-- CORRECCIÓN: Usar created_at en lugar de createdAt -->
          <span class="text-xs text-slate-500">Fecha: {{ new Date(ord.created_at || Date.now()).toLocaleDateString() }}</span>
        </div>
        <div>
          <span class="px-3 py-1.5 rounded-full text-xs font-bold border"
            :class="{
              'bg-yellow-50 text-yellow-700 border-yellow-200': ord.estado === 'CREADO',
              'bg-emerald-50 text-emerald-700 border-emerald-200': ord.estado === 'PAGADO',
              'bg-purple-50 text-purple-700 border-purple-200': ord.estado === 'EN_PREPARACION',
              'bg-blue-50 text-blue-700 border-blue-200': ord.estado === 'EN_CAMINO',
              'bg-slate-100 text-slate-600 border-slate-200': ord.estado === 'ENTREGADO',
              'bg-red-50 text-red-700 border-red-200': ord.estado === 'CANCELADO',
            }">
            {{ ord.estado }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>