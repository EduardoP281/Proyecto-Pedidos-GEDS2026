const API_URL = 'http://localhost:3000/api';

export const api = {
    async getCategories() {
        const response = await fetch(`${API_URL}/categories`);
        return response.json();
    },
    async createCategory(data) {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateCategory(id, data) {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteCategory(id) {
        const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
        return response.json();
    },

    async getProducts(categoryId = '') {
        const url = categoryId ? `${API_URL}/products?category_id=${categoryId}` : `${API_URL}/products`;
        const response = await fetch(url);
        return response.json();
    },
    async createProduct(data) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateProduct(id, data) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        return response.json();
    }
};
