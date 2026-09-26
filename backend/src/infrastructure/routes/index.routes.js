import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../../adapters/controllers/OrderController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/roles.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.post('/orders', verifyToken, createOrder);
router.get('/orders/my-orders', verifyToken, getMyOrders);
router.get('/orders/:id', verifyToken, getOrderById);
router.get('/orders', verifyToken, authorizeRoles('admin', 'repartidor'), getAllOrders);
router.patch('/orders/:id/status', verifyToken, authorizeRoles('admin', 'repartidor'), updateOrderStatus);

export default router;