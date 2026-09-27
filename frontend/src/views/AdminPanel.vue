<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const currentTab = ref('products');
const products = ref([]);
const categories = ref([]);
const orders = ref([]); 

const showProductModal = ref(false);
const editingProduct = ref(null);
const productForm = ref({ name: '', description: '', price: 0, stock: 0, category_id: '', image_url: '' });

const showCategoryModal = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({ name: '', description: '' });

const loadData = async () => {
  const catRes = await api.getCategories();
  if (catRes && catRes.status === 200 && catRes.data && catRes.data.success) categories.value = catRes.data.data;

  const prodRes = await api.getProducts();
  if (prodRes && prodRes.status === 200 && prodRes.data && prodRes.data.success) products.value = prodRes.data.data;

  try {
    const ordRes = await api.getAllOrders();
    if (ordRes && ordRes.status === 200 && ordRes.data && ordRes.data.success) {
      orders.value = ordRes.data.data;
    }
  } catch(e) {
    console.error("Error al cargar órdenes:", e);
  }
};

const changeOrderStatus = async (orderId, newStatus) => {
  try {
    await api.updateOrderStatus(orderId, newStatus); 
    await loadData();
  } catch (error) {
    alert(error.response?.data?.error?.message || error.message || 'Error al cambiar estado');
    await loadData(); 
  }
};

const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.category_id === id);
  return cat ? cat.name : 'N/A';
};

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

  try {
    if (editingProduct.value?.product_id) {
      await api.updateProduct(editingProduct.value.product_id, productForm.value);
    } else {
      await api.createProduct(productForm.value);
    }
    showProductModal.value = false;
    await loadData();
  } catch (error) {
    alert(error.message || 'Error al guardar el producto');
  }
};

const deleteProduct = async (id) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    await api.deleteProduct(id);
    await loadData();
  }
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
    alert(error.message || 'Error al guardar la categoría');
  }
};

const deleteCategory = async (id) => {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    await api.deleteCategory(id);
    await loadData();
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-slate-800">Panel de Administración</h2>
        <p class="mt-1 text-sm text-slate-500">Gestión del catálogo, inventario y ordenes del negocio.</p>
      </div>
      <button @click="currentTab = 'products'; openProductModal()" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Crear Producto</button>
    </div>

    <div class="mb-6 flex gap-2 border-b border-slate-200 pb-2">
      <button @click="currentTab = 'products'" :class="['rounded-lg px-3 py-2 text-sm font-medium', currentTab === 'products' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600']">Productos</button>
      <button @click="currentTab = 'categories'" :class="['rounded-lg px-3 py-2 text-sm font-medium', currentTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600']">Categorías</button>
      <button @click="currentTab = 'orders'" :class="['rounded-lg px-3 py-2 text-sm font-medium', currentTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600']">Pedidos</button>
    </div>

    <div v-if="currentTab === 'products'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Nombre</th>
            <th class="px-4 py-3">Precio</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3">Categoría</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.product_id" class="border-t border-slate-200">
            <td class="px-4 py-3 font-medium text-slate-700">{{ product.product_id }}</td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">${{ Number(product.price).toFixed(2) }}</td>
            <td class="px-4 py-3">{{ product.stock }}</td>
            <td class="px-4 py-3">{{ getCategoryName(product.category_id) }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <button @click="openProductModal(product)" class="rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-700">Editar</button>
                <button @click="deleteProduct(product.product_id)" class="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="6" class="px-4 py-10 text-center text-slate-500">No hay productos registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="currentTab === 'categories'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Nombre</th>
            <th class="px-4 py-3">Descripción</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.category_id" class="border-t border-slate-200">
            <td class="px-4 py-3 font-medium text-slate-700">{{ cat.category_id }}</td>
            <td class="px-4 py-3">{{ cat.name }}</td>
            <td class="px-4 py-3">{{ cat.description || 'Sin descripción' }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <button @click="openCategoryModal(cat)" class="rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-700">Editar</button>
                <button @click="deleteCategory(cat.category_id)" class="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="4" class="px-4 py-10 text-center text-slate-500">No hay categorías registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="currentTab === 'orders'" class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th class="px-4 py-3">ID Pedido</th>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t border-slate-200">
            <td class="px-4 py-3 font-medium text-slate-700">#{{ order.id }}</td>
            <td class="px-4 py-3">{{ order.customer_name || 'N/A' }}</td>
            <td class="px-4 py-3">{{ new Date(order.created_at).toLocaleDateString() }}</td>
            <td class="px-4 py-3">${{ Number(order.total).toFixed(2) }}</td>
            <td class="px-4 py-3">
              <select 
                :value="order.estado" 
                @change="changeOrderStatus(order.id, $event.target.value)"
                class="rounded border border-slate-300 p-1 text-xs outline-none"
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
            <td colspan="5" class="px-4 py-10 text-center text-slate-500">No hay pedidos registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-800">{{ editingProduct?.product_id ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button @click="showProductModal = false" class="text-slate-500">✕</button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
            <input v-model="productForm.name" required class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
            <textarea v-model="productForm.description" rows="3" class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Precio</label>
              <input v-model.number="productForm.price" type="number" min="0.01" step="0.01" required class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Stock</label>
              <input v-model.number="productForm.stock" type="number" min="0" required class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Categoría</label>
            <select v-model="productForm.category_id" required class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500">
              <option value="">Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">URL de imagen</label>
            <input v-model="productForm.image_url" class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showProductModal = false" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-800">{{ editingCategory?.category_id ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="showCategoryModal = false" class="text-slate-500">✕</button>
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
            <input v-model="categoryForm.name" required class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
            <textarea v-model="categoryForm.description" rows="3" class="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showCategoryModal = false" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>