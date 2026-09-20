import { randomUUID } from 'node:crypto';
import { ValidationError, NotFoundError } from '../../utils/errors.js';

export async function listCategories(categoryRepository) {
  return categoryRepository.list();
}

export async function createCategory(categoryRepository, payload) {
  const name = payload?.name?.trim();

  if (!name) {
    throw new ValidationError('El nombre de la categoría es obligatorio.');
  }

  const category = {
    id: randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };

  return categoryRepository.create(category);
}

export async function updateCategory(categoryRepository, categoryId, payload) {
  const existing = await categoryRepository.getById(categoryId);

  if (!existing) {
    throw new NotFoundError('Categoría no encontrada.');
  }

  const name = payload?.name?.trim();

  if (!name) {
    throw new ValidationError('El nombre de la categoría es obligatorio.');
  }

  const updated = {
    ...existing,
    name,
    updatedAt: new Date().toISOString(),
  };

  return categoryRepository.update(updated);
}

export async function deleteCategory(categoryRepository, categoryId) {
  const existing = await categoryRepository.getById(categoryId);

  if (!existing) {
    throw new NotFoundError('Categoría no encontrada.');
  }

  return categoryRepository.remove(categoryId);
}
