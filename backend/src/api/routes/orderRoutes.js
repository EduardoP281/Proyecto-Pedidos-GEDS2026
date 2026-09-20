import { Router } from 'express';
import { createOrder, listOrders, updateOrderStatus } from '../../application/usecases/orderUseCases.js';

export function buildOrderRoutes({ orderRepository, productRepository, transactionManager }) {
  const router = Router();

  router.get('/orders', async (_req, res, next) => {
    try {
      const orders = await listOrders(orderRepository);
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  });

  router.post('/orders', async (req, res, next) => {
    try {
      const order = await createOrder({ orderRepository, productRepository, transactionManager }, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/orders/:id/status', async (req, res, next) => {
    try {
      const order = await updateOrderStatus(orderRepository, req.params.id, req.body.status);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
