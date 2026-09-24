const API_URL = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, data };
}

const api = {
  get: (path, headers = {}) => request(path, { method: 'GET', headers }),
  post: (path, body, headers = {}) => request(path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }),
  put: (path, body, headers = {}) => request(path, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }),
  delete: (path, headers = {}) => request(path, { method: 'DELETE', headers }),

  // domain helpers
  getCategories: (headers = {}) => api.get('/categories', headers),
  createCategory: (data, headers = {}) => api.post('/categories', data, headers),
  updateCategory: (id, data, headers = {}) => api.put(`/categories/${id}`, data, headers),
  deleteCategory: (id, headers = {}) => api.delete(`/categories/${id}`, headers),

  getProducts: (categoryId = '', headers = {}) => api.get(categoryId ? `/products?category_id=${categoryId}` : '/products', headers),
  createProduct: (data, headers = {}) => api.post('/products', data, headers),
  updateProduct: (id, data, headers = {}) => api.put(`/products/${id}`, data, headers),
  deleteProduct: (id, headers = {}) => api.delete(`/products/${id}`, headers),
};

export default api;
