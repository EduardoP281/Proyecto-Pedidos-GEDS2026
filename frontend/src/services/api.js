import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Ocurrió un error en la solicitud.';

    return Promise.reject(new Error(message));
  }
);

api.getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

api.createCategory = async (data) => {
  const res = await api.post('/categories', data);
  return res.data;
};

api.updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

api.deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

api.getProducts = async (categoryId = '') => {
  const url = categoryId ? `/products?category_id=${categoryId}` : '/products';
  const res = await api.get(url);
  return res.data;
};

api.createProduct = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

api.updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

api.deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const apiMethods = api;
export default api;
