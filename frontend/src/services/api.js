import axios from 'axios';

const DEFAULT_API_URL = 'https://backend-development-8ce5.up.railway.app/api';

const normalizeApiBaseUrl = (value) => {
  if (!value) return '';

  let normalized = value.trim();

  if (normalized.startsWith('[') && normalized.includes('](')) {
    normalized = normalized.slice(1, normalized.indexOf(']('));
  } else if (normalized.startsWith('[') && normalized.endsWith(']')) {
    normalized = normalized.slice(1, -1);
  }

  if (normalized.startsWith('(') && normalized.endsWith(')')) {
    normalized = normalized.slice(1, -1);
  }

  return normalized.replace(/\/+$/, '');
};

const getApiBaseUrl = () => {
  const envUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  if (envUrl) {
    return envUrl;
  }

  return DEFAULT_API_URL;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
  return res;
};

api.createCategory = async (data) => {
  const res = await api.post('/categories', data);
  return res;
};

api.updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res;
};

api.deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res;
};

api.getProducts = async (categoryId = '') => {
  const url = categoryId ? `/products?category_id=${categoryId}` : '/products';
  const res = await api.get(url);
  return res;
};

api.createProduct = async (data) => {
  const res = await api.post('/products', data);
  return res;
};

api.updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res;
};

api.deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res;
};

export const apiMethods = api;
export default api;
