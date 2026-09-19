import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { CategoryController } from '../controllers/CategoryController.js';

const router = Router();
const productController = new ProductController();
const categoryController = new CategoryController();

router.get('/products', (req, res) => productController.getAll(req, res));
router.get('/products/:id', (req, res) => productController.getById(req, res));
router.post('/products', (req, res) => productController.create(req, res));
router.put('/products/:id', (req, res) => productController.update(req, res));
router.delete('/products/:id', (req, res) => productController.delete(req, res));

router.get('/categories', (req, res) => categoryController.getAll(req, res));
router.get('/categories/:id', (req, res) => categoryController.getById(req, res));
router.post('/categories', (req, res) => categoryController.create(req, res));
router.put('/categories/:id', (req, res) => categoryController.update(req, res));
router.delete('/categories/:id', (req, res) => categoryController.delete(req, res));

export default router;
