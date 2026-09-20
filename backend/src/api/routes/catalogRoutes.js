import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../../application/usecases/categoryUseCases.js';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../../application/usecases/productUseCases.js';

export function buildCatalogRoutes({ categoryRepository, productRepository }) {
  const router = Router();

  router.get('/categories', async (_req, res, next) => {
    try {
      const categories = await listCategories(categoryRepository);
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  });

  router.post('/categories', async (req, res, next) => {
    try {
      const category = await createCategory(categoryRepository, req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  });

  router.put('/categories/:id', async (req, res, next) => {
    try {
      const category = await updateCategory(categoryRepository, req.params.id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/categories/:id', async (req, res, next) => {
    try {
      await deleteCategory(categoryRepository, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.get('/products', async (req, res, next) => {
    try {
      const categoryId = req.query.categoryId ?? req.query.category_id ?? '';
      const products = await listProducts(productRepository, categoryId);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  });

  router.post('/products', async (req, res, next) => {
    try {
      const product = await createProduct(productRepository, req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  });

  router.put('/products/:id', async (req, res, next) => {
    try {
      const product = await updateProduct(productRepository, req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/products/:id', async (req, res, next) => {
    try {
      await deleteProduct(productRepository, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
