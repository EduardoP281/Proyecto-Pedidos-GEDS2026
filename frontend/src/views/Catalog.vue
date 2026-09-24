<template>
  <div class="catalog-container">
    <header>
      <h1>Catálogo de Productos</h1>
      <router-link to="/admin" class="btn">Panel Administrativo</router-link>
    </header>

    <div class="filters">
      <label for="category">Filtrar por categoría:</label>
      <select id="category" v-model="selectedCategory" @change="fetchProducts">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="product-grid" v-if="products.length > 0">
      <div v-for="product in products" :key="product.product_id" class="product-card">
        <img v-if="product.image_url" :src="product.image_url" alt="Imagen del producto" class="product-img" />
        <div v-else class="product-img placeholder">Sin imagen</div>
        <h3>{{ product.name }}</h3>
        <p class="desc">{{ product.description }}</p>
        <p class="price">Precio sin IVA: ${{ Number(product.price).toFixed(2) }}</p>
        <p class="price">Precio con IVA (13%): ${{ priceWithVAT(product.price) }}</p>
        <p class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
          Stock: {{ product.stock }}
        </p>
        <button class="btn btn-primary" :disabled="product.stock === 0" @click="addToCart(product)">Agregar al carrito</button>
      </div>
    </div>
    <div v-else>
      <p>No hay productos disponibles en esta categoría.</p>
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
  if (catRes && catRes.status === 200 && catRes.data && catRes.data.success) {
    categories.value = catRes.data.data;
  }
  await fetchProducts();
};

const fetchProducts = async () => {
  const prodRes = await api.getProducts(selectedCategory.value);
  if (prodRes && prodRes.status === 200 && prodRes.data && prodRes.data.success) {
    products.value = prodRes.data.data;
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

const priceWithVAT = (p) => Number((p * 1.13).toFixed(2));

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filters {
  margin-bottom: 20px;
}
.filters select {
  padding: 8px;
  margin-left: 10px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
.product-img.placeholder {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.desc {
  color: #666;
  font-size: 0.9em;
  flex-grow: 1;
}
.price {
  font-weight: bold;
  font-size: 1.2em;
  color: #2c3e50;
}
.stock {
  font-size: 0.9em;
  color: #27ae60;
}
.stock.out-of-stock {
  color: #c0392b;
}
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: #3498db;
  text-align: center;
}
.btn:hover {
  background: #2980b9;
}
.btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>
