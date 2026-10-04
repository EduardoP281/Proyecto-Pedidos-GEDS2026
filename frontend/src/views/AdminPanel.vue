<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const currentTab = ref('products');
const products = ref([]);
const categories = ref([]);
const orders = ref([]); 

// Estados para Modales
const showProductModal = ref(false);
const editingProduct = ref(null);
const productForm = ref({ name: '', description: '', price: 0, stock: 0, category_id: '', image_url: '' });

const showCategoryModal = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({ name: '', description: '' });

// Cargar toda la información del servidor
const loadData = async () => {
  try {
    const catRes = await api.getCategories();
    if (catRes?.status === 200 && catRes.data?.success) categories.value = catRes.data.data;

    const prodRes = await api.getProducts();
    if (prodRes?.status === 200 && prodRes.data?.success) products.value = prodRes.data.data;

    const ordRes = await api.getAllOrders();
    if (ordRes?.status === 200 && ordRes.data?.success) orders.value = ordRes.data.data;
  } catch(e) {
    console.error("Error al cargar datos:", e);
  }
};

// --- LÓGICA DE PEDIDOS ---
const changeOrderStatus = async (orderId, newStatus) => {
  try {
    await api.updateOrderStatus(orderId, newStatus); 
    await loadData();
  } catch (error) {
    alert(error.response?.data?.error?.message || error.message || 'Error al cambiar estado');
    await loadData(); 
  }
};

// --- LÓGICA DE CATEGORÍAS ---
const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.category_id === id);
  return cat ? cat.name : 'N/A';
};

const openCategoryModal = (cat = null) => {
  editingCategory.value = cat;
  if (cat) {
    categoryForm.value = { ...cat };
  } else {
    categoryForm.value = { name: '', description: '' };
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value?.category_id) {
      await api.updateCategory(editingCategory.value.category_id, categoryForm.value);
    } else {
      await api.createCategory(categoryForm.value);
    }
    showCategoryModal.value = false;
    await loadData();
  } catch (error) {
    alert(error.response?.data?.error?.message || error.message || 'Error al guardar la categoría');
  }
};

const deleteCategory = async (id) => {
  if (confirm('¿Está seguro de eliminar esta categoría? Si tiene productos asignados, podría dar error.')) {
    try {
      await api.deleteCategory(id);
      await loadData();
    } catch (error) {
      alert(error.response?.data?.error?.message || error.message || 'Error al eliminar categoría');
    }
  }
};

// --- LÓGICA DE PRODUCTOS ---
const openProductModal = (product = null) => {
  editingProduct.value = product;
  if (product) {
    productForm.value = { ...product };
  } else {
    productForm.value = { name: '', description: '', price: 0, stock: 0, category_id: '', image_url: '' };
  }
  showProductModal.value = true;
};

const saveProduct = async () => {
  if (productForm.value.price <= 0) return alert('El precio debe ser mayor a 0');
  if (productForm.value.stock < 0) return alert('El stock debe ser mayor o igual a 0');
  if (!productForm.value.category_id) return alert('Debe seleccionar una categoría');

  try {
    if (editingProduct.value?.product_id) {
      await api.updateProduct(editingProduct.value.product_id, productForm.value);
    } else {
      await api.createProduct(productForm.value);
    }
    showProductModal.value = false;
    await loadData();
  } catch (error) {
    alert(error.response?.data?.error?.message || error.message || 'Error al guardar el producto');
  }
};

const deleteProduct = async (id) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch(error) {
      alert(error.response?.data?.error?.message || error.message || 'Error al eliminar producto');
    }
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    
    <!-- ENCABEZADO Y BOTONES DINÁMICOS -->
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-slate-800">Panel de Administración</h2>
        <p class="mt-1 text-sm text-slate-500">Gestión del catálogo, inventario y órdenes del negocio.</p>
      </div>
      
      <!-- Se muestra solo si estamos en la pestaña Productos -->
      <button 
        v-if="currentTab === 'products'" 
        @click="openProductModal()" 
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
      >
        + Crear Producto
      </button>

      <!-- Se muestra solo si estamos en la pestaña Categorías -->
      <button 
        v-if="currentTab === 'categories'" 
        @click="openCategoryModal()" 
        class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
      >
        + Crear Categoría
      </button>
    </div>

    <!-- PESTAÑAS (TABS) -->
    <div class="mb-6 flex gap-2 border-b border-slate-200 pb-2">
      <button @click="currentTab = 'products'" :class="['rounded-lg px-3 py-2 text-sm font-medium transition', currentTab === 'products' ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Productos</button>
      <button @click="currentTab = 'categories'" :class="['rounded-lg px-3 py-2 text-sm font-medium transition', currentTab === 'categories' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Categorías</button>
      <button @click="currentTab = 'orders'" :class="['rounded-lg px-3 py-2 text-sm font-medium transition', currentTab === 'orders' ? 'bg-slate-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">Pedidos</button>
    </div>

    <!-- TABLA DE PRODUCTOS -->
    <div v-if="currentTab === 'products'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold">ID</th>
            <th class="px-4 py-3 font-semibold">Nombre</th>
            <th class="px-4 py-3 font-semibold">Precio</th>
            <th class="px-4 py-3 font-semibold">Stock</th>
            <th class="px-4 py-3 font-semibold">Categoría</th>
            <th class="px-4 py-3 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.product_id" class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
            <td class="px-4 py-3 font-medium text-slate-700">{{ product.product_id }}</td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3 font-medium">${{ Number(product.price).toFixed(2) }}</td>
            <td class="px-4 py-3">
              <span :class="product.stock === 0 ? 'text-red-600 font-bold' : 'text-slate-600'">{{ product.stock }}</span>
            </td>
            <td class="px-4 py-3">{{ getCategoryName(product.category_id) }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <button @click="openProductModal(product)" class="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">Editar</button>
                <button @click="deleteProduct(product.product_id)" class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="6" class="px-4 py-10 text-center text-slate-500">No hay productos registrados en el catálogo.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TABLA DE CATEGORÍAS -->
    <div v-if="currentTab === 'categories'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold">ID</th>
            <th class="px-4 py-3 font-semibold">Nombre</th>
            <th class="px-4 py-3 font-semibold">Descripción</th>
            <th class="px-4 py-3 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.category_id" class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
            <td class="px-4 py-3 font-medium text-slate-700">{{ cat.category_id }}</td>
            <td class="px-4 py-3 font-medium text-slate-900">{{ cat.name }}</td>
            <td class="px-4 py-3">{{ cat.description || 'Sin descripción' }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <button @click="openCategoryModal(cat)" class="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">Editar</button>
                <button @click="deleteCategory(cat.category_id)" class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="4" class="px-4 py-10 text-center text-slate-500">No hay categorías registradas. Cree una nueva.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TABLA DE PEDIDOS -->
    <div v-if="currentTab === 'orders'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold">ID Pedido</th>
            <th class="px-4 py-3 font-semibold">Cliente</th>
            <th class="px-4 py-3 font-semibold">Fecha</th>
            <th class="px-4 py-3 font-semibold">Total (c/ IVA)</th>
            <th class="px-4 py-3 font-semibold">Estado Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
            <td class="px-4 py-3 font-medium text-slate-700">#{{ order.id }}</td>
            <td class="px-4 py-3">{{ order.customer_name || 'N/A' }}</td>
            <td class="px-4 py-3">{{ new Date(order.created_at).toLocaleDateString() }}</td>
            <td class="px-4 py-3 font-medium text-slate-900">${{ Number(order.total).toFixed(2) }}</td>
            <td class="px-4 py-3">
              <select 
                :value="order.estado" 
                @change="changeOrderStatus(order.id, $event.target.value)"
                class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none focus:border-blue-500 transition"
                :class="{
                  'bg-yellow-50 text-yellow-700 border-yellow-200': order.estado === 'CREADO',
                  'bg-emerald-50 text-emerald-700 border-emerald-200': order.estado === 'PAGADO',
                  'bg-blue-50 text-blue-700 border-blue-200': order.estado === 'EN_CAMINO',
                  'bg-slate-100 text-slate-500 border-slate-200': order.estado === 'ENTREGADO',
                  'bg-red-50 text-red-700 border-red-200': order.estado === 'CANCELADO',
                }"
              >
                <option value="CREADO">CREADO</option>
                <option value="PAGADO">PAGADO</option>
                <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                <option value="EN_CAMINO">EN CAMINO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="5" class="px-4 py-10 text-center text-slate-500">No hay pedidos registrados en el sistema.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL DE PRODUCTO -->
    <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-800">{{ editingProduct?.product_id ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button @click="showProductModal = false" class="text-slate-400 hover:text-slate-600 transition"><span class="material-symbols-outlined">close</span></button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Nombre del Producto</label>
            <input v-model="productForm.name" required class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Descripción</label>
            <textarea v-model="productForm.description" rows="3" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-700">Precio (Sin IVA)</label>
              <input v-model.number="productForm.price" type="number" min="0.01" step="0.01" required class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-700">Stock Inicial</label>
              <input v-model.number="productForm.stock" type="number" min="0" required class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition" />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Categoría</label>
            <select v-model="productForm.category_id" required class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition">
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
            </select>
            <p v-if="!categories.length" class="mt-1 text-xs text-red-500">Debe crear una categoría primero.</p>
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">URL de Imagen (Opcional)</label>
            <input v-model="productForm.image_url" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition" />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="showProductModal = false" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancelar</button>
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition">Guardar Producto</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DE CATEGORÍA -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-800">{{ editingCategory?.category_id ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="showCategoryModal = false" class="text-slate-400 hover:text-slate-600 transition"><span class="material-symbols-outlined">close</span></button>
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Nombre de la Categoría</label>
            <input v-model="categoryForm.name" required class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Descripción</label>
            <textarea v-model="categoryForm.description" rows="3" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="showCategoryModal = false" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancelar</button>
            <button type="submit" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition">Guardar Categoría</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>