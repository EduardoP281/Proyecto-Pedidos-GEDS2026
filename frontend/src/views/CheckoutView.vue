<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { ordersService } from '../services/orders';

const cart = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');

const form = ref({
  direccion: '',
  telefono: '',
  metodoPago: 'EFECTIVO',
});

const procesarPedido = async () => {
  if (cart.items.length === 0) return;
  errorMessage.value = '';
  loading.value = true;

  const payload = {
    customer_id: authStore.user?.user_id ?? null,
    direccionEntrega: form.value.direccion,
    telefonoContacto: form.value.telefono,
    metodoPago: form.value.metodoPago,
    notes: `Entrega: ${form.value.direccion} | Tel: ${form.value.telefono}`,
    items: cart.items.map((item) => ({
      product_id: item.product.product_id,
      quantity: item.quantity,
      unit_price: Number(item.product.price || 0),
    })),
  };

  try {
    const res = await ordersService.createOrder(payload);
    const orderId = res.data?.id || res.data?.order_id || res.data?.data?.id || res.data?.data?.order_id || 'OK';
    cart.clear();
    router.push({ name: 'OrderConfirmation', query: { orderId } });
  } catch (error) {
    errorMessage.value = error.message || 'Error al procesar el pedido transaccional.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border mt-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Checkout Transaccional (RF-05)</h1>

    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="procesarPedido" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
        <textarea
          v-model="form.direccion"
          required
          rows="3"
          placeholder="Calle, avenida, colonia, número de casa..."
          class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
        <input
          v-model="form.telefono"
          type="tel"
          required
          placeholder="7000-0000"
          class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
        <select
          v-model="form.metodoPago"
          class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="EFECTIVO">Efectivo contra entrega</option>
          <option value="TARJETA">Tarjeta de Crédito / Débito</option>
        </select>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700 border">
        <div class="flex justify-between"><span>Subtotal (Neto):</span><span>${{ cart.subtotalSinIva.toFixed(2) }}</span></div>
        <div class="flex justify-between"><span>IVA (13%):</span><span>${{ cart.montoIva.toFixed(2) }}</span></div>
        <div class="flex justify-between font-bold text-base text-gray-900 border-t pt-2">
          <span>Total a Pagar:</span><span class="text-green-600">${{ cart.totalConIva.toFixed(2) }}</span>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading || cart.items.length === 0"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer shadow"
      >
        {{ loading ? 'Procesando transacción ACID...' : 'Confirmar Pedido' }}
      </button>
    </form>
  </div>
</template>