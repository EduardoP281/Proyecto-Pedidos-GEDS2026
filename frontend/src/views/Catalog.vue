<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Catálogo de Productos</h1>
        <p class="mt-1 text-slate-600">Productos disponibles con precios y stock actualizados.</p>
      </div>
      <router-link to="/admin" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Panel Administrativo</router-link>
    </header>

    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label for="category" class="mr-3 text-sm font-medium text-slate-700">Filtrar por categoría:</label>
      <select id="category" v-model="selectedCategory" @change="fetchProducts" class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
      </select>
    </div>

    <div v-if="products.length > 0" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="product in products" :key="product.product_id" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <img v-if="product.image_url" :src="product.image_url" alt="Imagen del producto" class="h-48 w-full object-cover" />
        <div v-else class="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">Sin imagen</div>

        <div class="space-y-3 p-4">
          <h3 class="text-lg font-bold text-slate-900">{{ product.name }}</h3>
          <p class="text-sm text-slate-600">{{ product.description }}</p>
          <div class="text-sm text-slate-700">
            <p><span class="font-semibold">Sin IVA:</span> ${{ Number(product.price).toFixed(2) }}</p>
            <p><span class="font-semibold">Con IVA:</span> ${{ priceWithVAT(product.price) }}</p>
            <p :class="product.stock === 0 ? 'text-red-600' : 'text-emerald-600'">Stock: {{ product.stock }}</p>
          </div>
          <button class="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300" :disabled="product.stock === 0" @click="addToCart(product)">Agregar al carrito</button>
        </div>
      </article>
    </div>

    <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      No hay productos disponibles en esta categoría.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref('');

const loadData = async () => {
  const catRes = await api.getCategories();
  if (catRes && catRes.data && catRes.data.success) {
    categories.value = catRes.data.data || [];
  }
  await fetchProducts();
};

const fetchProducts = async () => {
  const prodRes = await api.getProducts(selectedCategory.value);
  if (prodRes && prodRes.data && prodRes.data.success) {
    products.value = prodRes.data.data || [];
  } else {
    products.value = [];
  }
};

const addToCart = (product) => {
  const ok = cart.addItem(product, 1);
  if (!ok) {
    alert('No hay suficiente stock para agregar este producto.');
  }
};

const priceWithVAT = (value) => Number((Number(value || 0) * 1.13).toFixed(2));

onMounted(() => {
  loadData();
});
</script>
