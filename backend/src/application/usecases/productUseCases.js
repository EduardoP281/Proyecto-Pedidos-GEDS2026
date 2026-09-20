import { randomUUID } from 'node:crypto';
import { ValidationError, NotFoundError } from '../../utils/errors.js';

const normalizeCategoryId = (payload) => payload?.categoryId ?? payload?.category_id ?? null;

export async function listProducts(productRepository, categoryId) {
  const normalizedCategoryId = categoryId ?? categoryId?.toString?.() ?? '';
  if (normalizedCategoryId) {
    return productRepository.listByCategory(normalizedCategoryId);
  }

  return productRepository.list();
}

export async function createProduct(productRepository, payload) {
  const name = payload?.name?.trim();
  const categoryId = normalizeCategoryId(payload);
  const price = Number(payload?.price);
  const stock = Number(payload?.stock ?? 0);

  if (!name) {
    throw new ValidationError('El nombre del producto es obligatorio.');
  }

  if (!categoryId) {
    throw new ValidationError('Debe indicar la categoría del producto.');
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new ValidationError('El precio del producto debe ser mayor a 0.');
  }

  if (!Number.isFinite(stock) || stock < 0) {
    throw new ValidationError('El stock del producto no puede ser menor a 0.');
  }

  const product = {
    id: randomUUID(),
    name,
    description: payload?.description ?? '',
    categoryId,
    price,
    stock,
    createdAt: new Date().toISOString(),
  };

  return productRepository.create(product);
}

export async function updateProduct(productRepository, productId, payload) {
  const existing = await productRepository.getById(productId);

  if (!existing) {
    throw new NotFoundError('Producto no encontrado.');
  }

  const price = Number(payload?.price ?? existing.price);
  const stock = Number(payload?.stock ?? existing.stock);

  if (!Number.isFinite(price) || price <= 0) {
    throw new ValidationError('El precio del producto debe ser mayor a 0.');
  }

  if (!Number.isFinite(stock) || stock < 0) {
    throw new ValidationError('El stock del producto no puede ser menor a 0.');
  }

  const updated = {
    ...existing,
    name: payload?.name?.trim() || existing.name,
    description: payload?.description ?? existing.description,
    categoryId: normalizeCategoryId(payload) ?? existing.categoryId,
    price,
    stock,
    updatedAt: new Date().toISOString(),
  };

  return productRepository.update(updated);
}

export async function deleteProduct(productRepository, productId) {
  const existing = await productRepository.getById(productId);

  if (!existing) {
    throw new NotFoundError('Producto no encontrado.');
  }

  return productRepository.remove(productId);
}
