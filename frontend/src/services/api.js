const API_URL = 'http://localhost:3000/api';

const parseJsonResponse = async (response) => {
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, data: null };
    }

    const text = await response.text();
    if (!text) {
        return { success: true, data: null };
    }

    return JSON.parse(text);
};

export const api = {
    async getCategories() {
        const response = await fetch(`${API_URL}/categories`);
        return parseJsonResponse(response);
    },
    async createCategory(data) {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return parseJsonResponse(response);
    },
    async updateCategory(id, data) {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return parseJsonResponse(response);
    },
    async deleteCategory(id) {
        const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
        return parseJsonResponse(response);
    },

    async getProducts(categoryId = '') {
        const url = categoryId ? `${API_URL}/products?category_id=${encodeURIComponent(categoryId)}` : `${API_URL}/products`;
        const response = await fetch(url);
        return parseJsonResponse(response);
    },
    async createProduct(data) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                categoryId: data.categoryId ?? data.category_id,
                stock: Number(data.stock ?? 0),
                price: Number(data.price ?? 0),
            }),
        });
        return parseJsonResponse(response);
    },
    async updateProduct(id, data) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                categoryId: data.categoryId ?? data.category_id,
                stock: Number(data.stock ?? 0),
                price: Number(data.price ?? 0),
            }),
        });
        return parseJsonResponse(response);
    },
    async deleteProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        return parseJsonResponse(response);
    },

    async getOrders() {
        const response = await fetch(`${API_URL}/orders`);
        return parseJsonResponse(response);
    },
    async createOrder(payload) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return parseJsonResponse(response);
    },
    async updateOrderStatus(id, status) {
        const response = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        return parseJsonResponse(response);
    },
};
