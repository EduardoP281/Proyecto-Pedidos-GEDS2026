import { randomUUID } from 'node:crypto';
import { CategoryRepository, ProductRepository, OrderRepository } from '../../application/contracts/repositories.js';

const defaultCategories = [
  { id: 'cat-1', name: 'Bebidas' },
  { id: 'cat-2', name: 'Snacks' },
  { id: 'cat-3', name: 'Limpieza' },
];

const defaultProducts = [
  { id: 'prod-1', name: 'Agua mineral', description: 'Botella 1L', categoryId: 'cat-1', price: 2.5, stock: 20 },
  { id: 'prod-2', name: 'Galletas', description: 'Paquete familiar', categoryId: 'cat-2', price: 4.2, stock: 15 },
  { id: 'prod-3', name: 'Detergente', description: 'Envase 2L', categoryId: 'cat-3', price: 6.8, stock: 8 },
];

export class MemoryCategoryRepository extends CategoryRepository {
  constructor(initialData = defaultCategories) {
    super();
    this.items = initialData.map((item) => ({ ...item }));
  }

  async list() {
    return [...this.items];
  }

  async getById(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(category) {
    this.items.push({ ...category, id: category.id ?? randomUUID() });
    return this.items.at(-1);
  }

  async update(category) {
    const index = this.items.findIndex((item) => item.id === category.id);

    if (index === -1) {
      return null;
    }

    this.items[index] = { ...this.items[index], ...category };
    return this.items[index];
  }

  async remove(id) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }
}

export class MemoryProductRepository extends ProductRepository {
  constructor(initialData = defaultProducts) {
    super();
    this.items = initialData.map((item) => ({ ...item }));
  }

  async list() {
    return [...this.items];
  }

  async listByCategory(categoryId) {
    return this.items.filter((item) => item.categoryId === categoryId);
  }

  async getById(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(product) {
    this.items.push({ ...product, id: product.id ?? randomUUID() });
    return this.items.at(-1);
  }

  async update(product) {
    const index = this.items.findIndex((item) => item.id === product.id);

    if (index === -1) {
      return null;
    }

    this.items[index] = { ...this.items[index], ...product };
    return this.items[index];
  }

  async remove(id) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }
}

export class MemoryOrderRepository extends OrderRepository {
  constructor() {
    super();
    this.items = [];
  }

  async list() {
    return [...this.items];
  }

  async getById(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(order) {
    this.items.push({ ...order, id: order.id ?? randomUUID() });
    return this.items.at(-1);
  }

  async updateStatus(id, nextStatus) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.items[index] = { ...this.items[index], status: nextStatus, updatedAt: new Date().toISOString() };
    return this.items[index];
  }
}

export class MemoryTransactionManager {
  constructor({ categoryRepository, productRepository, orderRepository }) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }

  async withTransaction(callback) {
    const snapshot = {
      categories: JSON.parse(JSON.stringify(this.categoryRepository.items)),
      products: JSON.parse(JSON.stringify(this.productRepository.items)),
      orders: JSON.parse(JSON.stringify(this.orderRepository.items)),
    };

    try {
      return await callback();
    } catch (error) {
      this.categoryRepository.items = JSON.parse(JSON.stringify(snapshot.categories));
      this.productRepository.items = JSON.parse(JSON.stringify(snapshot.products));
      this.orderRepository.items = JSON.parse(JSON.stringify(snapshot.orders));
      throw error;
    }
  }
}
