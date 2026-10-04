<script setup>
import { ref, onMounted } from 'vue';
import { ordersService } from '../services/orders';

const orders = ref([]);
const loading = ref(false);

// RF-06: Máquina de estados estricta en el frontend
const transicionesValidas = {
  CREADO: ['PAGADO', 'CANCELADO'],
  PAGADO: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['EN_CAMINO', 'CANCELADO'],
  EN_CAMINO: ['ENTREGADO', 'CANCELADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

const cargarOrdenes = async () => {
  loading.value = true;
  try {
    const res = await ordersService.getAllOrders();
    // CORRECCIÓN: Extraer correctamente el arreglo de datos del Envelope Pattern
    orders.value = res.data?.data || res.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const cambiarEstado = async (orderId, nuevoEstado) => {
  try {
    await ordersService.updateOrderStatus(orderId, nuevoEstado);
    await cargarOrdenes();
  } catch (err) {
    // Manejo del error con Envelope Pattern
    alert(err.response?.data?.error?.message || err.message || 'Error al ejecutar transición de estado');
  }
};

onMounted(cargarOrdenes);
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-slate-800">Monitoreo de Pedidos - Admin/Repartidor (RF-10)</h1>

    <div v-if="loading" class="text-center py-8 text-slate-500">Actualizando lista de pedidos...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Dirección / Teléfono</th>
            <th class="p-4">Total</th>
            <th class="p-4">Estado Actual</th>
            <th class="p-4">Transición Siguiente (Máquina de Estados)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="ord in orders" :key="ord.id" class="hover:bg-slate-50 transition">
            <td class="p-4 font-bold text-slate-900">#{{ ord.id }}</td>
            <td class="p-4">
              <p class="font-medium text-slate-800">{{ ord.direccionEntrega || 'Sin dirección' }}</p>
              <p class="text-xs text-slate-400">Tel: {{ ord.telefonoContacto || 'N/A' }}</p>
            </td>
            <td class="p-4 font-bold text-slate-900">${{ Number(ord.total).toFixed(2) }}</td>
            <td class="p-4">
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
            </td>
            <td class="p-4">
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="sig in transicionesValidas[ord.estado]"
                  :key="sig"
                  @click="cambiarEstado(ord.id, sig)"
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  &rarr; {{ sig }}
                </button>
                <span v-if="transicionesValidas[ord.estado]?.length === 0" class="text-xs text-slate-400 font-semibold">
                  Estado Final Alcanzado
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="5" class="p-8 text-center text-slate-500">No hay pedidos registrados en el sistema.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>