<template>
  <div class="admin-panel">
    <header>
      <h1>Panel Administrativo</h1>
      <router-link to="/" class="btn">Ver Catálogo</router-link>
    </header>

    <div class="tabs">
      <button :class="{ active: currentTab === 'products' }" @click="currentTab = 'products'">Productos</button>
      <button :class="{ active: currentTab === 'categories' }" @click="currentTab = 'categories'">Categorías</button>
    </div>

    <div v-if="currentTab === 'products'">
      <div class="header-action">
        <h2>Gestión de Productos</h2>
        <button class="btn btn-success" @click="openProductModal()">Nuevo Producto</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.product_id">
            <td>{{ product.product_id }}</td>
            <td>{{ product.name }}</td>
            <td>${{ Number(product.price).toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ getCategoryName(product.category_id) }}</td>
            <td>
              <button class="btn btn-sm btn-edit" @click="openProductModal(product)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(product.product_id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="currentTab === 'categories'">
      <div class="header-action">
        <h2>Gestión de Categorías</h2>
        <button class="btn btn-success" @click="openCategoryModal()">Nueva Categoría</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.category_id">
            <td>{{ cat.category_id }}</td>
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td>
              <button class="btn btn-sm btn-edit" @click="openCategoryModal(cat)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="deleteCategory(cat.category_id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Producto -->
    <div v-if="showProductModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingProduct?.product_id ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="productForm.name" required />
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="productForm.description"></textarea>
          </div>
          <div class="form-group">
            <label>Precio:</label>
            <input type="number" step="0.01" v-model="productForm.price" required min="0.01" />
          </div>
          <div class="form-group">
            <label>Stock:</label>
            <input type="number" v-model="productForm.stock" required min="0" />
          </div>
          <div class="form-group">
            <label>Categoría:</label>
            <select v-model="productForm.category_id" required>
              <option value="">Seleccione una</option>
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>URL Imagen:</label>
            <input v-model="productForm.image_url" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn" @click="showProductModal = false">Cancelar</button>
            <button type="submit" class="btn btn-success">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Categoría -->
    <div v-if="showCategoryModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingCategory?.category_id ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="categoryForm.name" required />
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="categoryForm.description"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn" @click="showCategoryModal = false">Cancelar</button>
            <button type="submit" class="btn btn-success">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const currentTab = ref('products');
const products = ref([]);
const categories = ref([]);

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
};

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.category_id === id);
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
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (editingProduct.value?.product_id) {
      await api.updateProduct(editingProduct.value.product_id, productForm.value, headers);
    } else {
      await api.createProduct(productForm.value, headers);
    }
    showProductModal.value = false;
    await loadData();
  } catch (error) {
    alert('Error al guardar el producto');
  }
};

const deleteProduct = async (id) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await api.deleteProduct(id, headers);
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
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (editingCategory.value?.category_id) {
      await api.updateCategory(editingCategory.value.category_id, categoryForm.value, headers);
    } else {
      await api.createCategory(categoryForm.value, headers);
    }
    showCategoryModal.value = false;
    await loadData();
  } catch (error) {
    alert('Error al guardar la categoría');
  }
};

const deleteCategory = async (id) => {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await api.deleteCategory(id, headers);
    await loadData();
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.admin-panel {
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
.tabs {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1em;
}
.tabs button.active {
  border-bottom: 2px solid #3498db;
  color: #3498db;
  font-weight: bold;
}
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.data-table th {
  background-color: #f4f4f4;
}
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: #7f8c8d;
}
.btn-success { background: #2ecc71; }
.btn-primary { background: #3498db; }
.btn-danger { background: #e74c3c; }
.btn-edit { background: #f39c12; margin-right: 5px; }
.btn-sm { padding: 5px 8px; font-size: 0.9em; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
