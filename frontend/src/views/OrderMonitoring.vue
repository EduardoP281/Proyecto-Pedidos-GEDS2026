<script setup>
import { ref, onMounted } from 'vue';
import { ordersService } from '../services/orders';

const orders = ref([]);
const loading = ref(false);

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
    orders.value = res.data;
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
    alert(err.message || 'Error al ejecutar transición de estado');
  }
};

onMounted(cargarOrdenes);
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Monitoreo de Pedidos - Admin/Repartidor (RF-10)</h1>

    <div v-if="loading" class="text-center py-8 text-gray-500">Actualizando lista de pedidos...</div>

    <div v-else class="bg-white rounded-xl shadow border overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Dirección / Teléfono</th>
            <th class="p-4">Total</th>
            <th class="p-4">Estado Actual</th>
            <th class="p-4">Transición Siguiente (Máquina de Estados)</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="ord in orders" :key="ord.id">
            <td class="p-4 font-bold text-gray-900">#{{ ord.id }}</td>
            <td class="p-4">
              <p class="font-medium text-gray-800">{{ ord.direccionEntrega || 'Sin dirección' }}</p>
              <p class="text-xs text-gray-400">Tel: {{ ord.telefonoContacto || 'N/A' }}</p>
            </td>
            <td class="p-4 font-bold text-gray-900">${{ Number(ord.total).toFixed(2) }}</td>
            <td class="p-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold"
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
            </td>
            <td class="p-4">
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="sig in transicionesValidas[ord.estado]"
                  :key="sig"
                  @click="cambiarEstado(ord.id, sig)"
                  class="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded text-xs font-bold transition cursor-pointer"
                >
                  &rarr; {{ sig }}
                </button>
                <span v-if="transicionesValidas[ord.estado]?.length === 0" class="text-xs text-gray-400 font-semibold">
                  Estado Final
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>