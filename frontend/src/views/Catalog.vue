<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref('');
const searchTerm = ref('');

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

const filteredProducts = () => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return products.value;
  return products.value.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(term));
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

<template>
  <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-slate-800">Catálogo de Productos</h2>
        <p class="mt-1 text-sm text-slate-500">Explora el inventario disponible y gestiona la venta con precios actualizados.</p>
      </div>
      <div class="flex min-w-[240px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
        <span class="material-symbols-outlined text-base">search</span>
        <input v-model="searchTerm" placeholder="Buscar por nombre o SKU..." class="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none" />
      </div>
    </div>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''; fetchProducts()"
          :class="['rounded-lg px-3 py-1.5 text-sm font-medium transition', selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200']"
        >
          Todos
        </button>
        <button
          v-for="cat in categories"
          :key="cat.category_id"
          @click="selectedCategory = String(cat.category_id); fetchProducts()"
          :class="['rounded-lg px-3 py-1.5 text-sm font-medium transition', String(selectedCategory) === String(cat.category_id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200']"
        >
          {{ cat.name }}
        </button>
      </div>

      <div class="text-sm text-slate-500">Mostrando {{ filteredProducts().length }} productos</div>
    </div>

    <div v-if="filteredProducts().length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="product in filteredProducts()" :key="product.product_id" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex h-44 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
          <img v-if="product.image_url" :src="product.image_url" alt="Imagen del producto" class="h-full w-full object-cover" />
          <span v-else class="material-symbols-outlined text-5xl">image</span>
        </div>

        <div class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-bold text-slate-900">{{ product.name }}</h3>
            <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{{ product.stock > 0 ? 'Disponible' : 'Sin stock' }}</span>
          </div>

          <p class="text-sm text-slate-600 line-clamp-3">{{ product.description }}</p>

          <div class="space-y-1 text-sm text-slate-700">
            <div class="flex justify-between"><span>Sin IVA</span><strong>${{ Number(product.price).toFixed(2) }}</strong></div>
            <div class="flex justify-between"><span>Con IVA</span><strong>${{ priceWithVAT(product.price).toFixed(2) }}</strong></div>
            <div class="flex justify-between"><span>Stock</span><span :class="product.stock === 0 ? 'text-red-600' : 'text-emerald-600'">{{ product.stock }}</span></div>
          </div>

          <button
            class="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="product.stock === 0"
            @click="addToCart(product)"
          >
            Agregar al carrito
          </button>
        </div>
      </article>
    </div>

    <div v-else class="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-10 py-16 text-center text-slate-500">
      <div class="mb-4 flex justify-center">
        <span class="material-symbols-outlined text-5xl text-slate-400">shopping_cart</span>
      </div>
      <p class="text-lg font-semibold text-slate-700">No se encontraron productos</p>
      <button @click="selectedCategory = ''; searchTerm = ''; fetchProducts()" class="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
        Restablecer filtros
      </button>
    </div>
  </div>
</template>

