import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { CategoryController } from '../controllers/CategoryController.js';
import { register, login } from '../../adapters/controllers/AuthController.js';
import { verifyToken } from '../../infrastructure/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../infrastructure/middlewares/roles.middleware.js';
import { createOrder } from '../../adapters/controllers/OrderController.js';

const router = Router();
const productController = new ProductController();
const categoryController = new CategoryController();

router.get('/products', (req, res) => productController.getAll(req, res));
router.get('/products/:id', (req, res) => productController.getById(req, res));
router.post('/products', verifyToken, authorizeRoles('admin'), (req, res) => productController.create(req, res));
router.put('/products/:id', verifyToken, authorizeRoles('admin'), (req, res) => productController.update(req, res));
router.delete('/products/:id', verifyToken, authorizeRoles('admin'), (req, res) => productController.delete(req, res));

router.get('/categories', (req, res) => categoryController.getAll(req, res));
router.get('/categories/:id', (req, res) => categoryController.getById(req, res));
router.post('/categories', verifyToken, authorizeRoles('admin'), (req, res) => categoryController.create(req, res));
router.put('/categories/:id', verifyToken, authorizeRoles('admin'), (req, res) => categoryController.update(req, res));
router.delete('/categories/:id', verifyToken, authorizeRoles('admin'), (req, res) => categoryController.delete(req, res));

// auth
router.post('/auth/register', (req, res) => register(req, res));
router.post('/auth/login', (req, res) => login(req, res));

// orders
router.post('/orders', verifyToken, (req, res) => createOrder(req, res));

export default router;
