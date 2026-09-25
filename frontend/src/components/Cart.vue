    <template>
  <!-- Tu tabla de html normal -->
  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio (Sin IVA)</th>
        <th>IVA (13%)</th>
        <th>Precio Total (Con IVA)</th>
      </tr>
    </thead>
    <tbody>
      <!-- Iteras sobre el arreglo computado, no sobre el original -->
      <tr v-for="item in carritoConIva" :key="item.product_id">
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>${{ item.precioFilaSinIva }}</td>
        <td>${{ item.montoFilaIva }}</td>
        <td>${{ item.precioFilaConIva }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';

// Suponiendo que tienes tus items del carrito en una variable "cartItems" (ya sea de props, ref o Pinia)
const props = defineProps(['cartItems']);

// AQUI VA EL PASO 3
const carritoConIva = computed(() => {
  return props.cartItems.map(item => {
    const precioUnitario = Number(item.unit_price || item.price);
    const precioSinIva = precioUnitario / 1.13;
    const montoIva = precioUnitario - precioSinIva;
    
    return {
      ...item,
      precioFilaSinIva: (precioSinIva * item.quantity).toFixed(2),
      montoFilaIva: (montoIva * item.quantity).toFixed(2),
      precioFilaConIva: (precioUnitario * item.quantity).toFixed(2)
    };
  });
});
</script>