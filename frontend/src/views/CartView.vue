<script setup>
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const router = useRouter();

const irAlCheckout = () => {
  if (cart.items.length > 0) {
    router.push('/checkout');
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Carrito de Compras (RF-04)</h1>
      <router-link to="/catalog" class="text-blue-600 font-medium hover:underline">
        &larr; Seguir comprando
      </router-link>
    </div>

    <div v-if="cart.items.length === 0" class="text-center py-16 bg-white rounded-xl shadow border">
      <span class="material-symbols-outlined text-6xl text-gray-400 mb-3">shopping_cart</span>
      <p class="text-gray-500 mb-4 text-lg">Tu carrito está vacío.</p>
      <router-link to="/catalog" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition">
        Ver catálogo de productos
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Tabla de productos -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow border overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b">
            <tr>
              <th class="p-4">Producto</th>
              <th class="p-4 text-center">Cant.</th>
              <th class="p-4 text-right">P. Sin IVA</th>
              <th class="p-4 text-right">P. Con IVA (13%)</th>
              <th class="p-4 text-right">Subtotal Neto</th>
              <th class="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="item in cart.items" :key="item.id">
              <td class="p-4 font-semibold text-gray-900">{{ item.nombre }}</td>
              <td class="p-4 text-center">
                <div class="inline-flex items-center border rounded-lg bg-gray-50">
                  <button 
                    @click="cart.updateQuantity(item.id, item.cantidad - 1)" 
                    class="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l cursor-pointer"
                  >-</button>
                  <span class="px-3 py-1 font-bold text-gray-800">{{ item.cantidad }}</span>
                  <button 
                    @click="cart.updateQuantity(item.id, item.cantidad + 1)" 
                    class="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r cursor-pointer"
                  >+</button>
                </div>
              </td>
              <td class="p-4 text-right">${{ Number(item.precioSinIva).toFixed(2) }}</td>
              <td class="p-4 text-right text-blue-600 font-medium">${{ Number(item.precioConIva).toFixed(2) }}</td>
              <td class="p-4 text-right font-bold text-gray-900">
                ${{ (item.precioSinIva * item.cantidad).toFixed(2) }}
              </td>
              <td class="p-4 text-center">
                <button @click="cart.removeItem(item.id)" class="text-red-500 hover:text-red-700 cursor-pointer">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen Económico -->
      <div class="bg-white p-6 rounded-xl shadow border h-fit space-y-4">
        <h2 class="text-xl font-bold text-gray-800 border-b pb-3">Resumen de la Orden</h2>
        <div class="flex justify-between text-gray-600">
          <span>Subtotal Neto:</span>
          <span>${{ cart.subtotalSinIva.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>IVA Calculado (13%):</span>
          <span>${{ cart.montoIva.toFixed(2) }}</span>
        </div>
        <div class="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
          <span>Total a Pagar:</span>
          <span class="text-green-600">${{ cart.totalConIva.toFixed(2) }}</span>
        </div>
        <button 
          @click="irAlCheckout"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer shadow"
        >
          Proceder al Checkout (RF-05)
        </button>
      </div>
    </div>
  </div>
</template>