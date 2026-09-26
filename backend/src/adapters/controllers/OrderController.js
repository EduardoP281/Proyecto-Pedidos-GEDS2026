import { createOrderUseCase } from '../../application/usecases/orders/CreateOrder.js';

export const createOrder = async (req, res, next) => {
  try {
    const user = req.user || {};
    const customer_id = user.user_id || req.body.customer_id;
    const { address_id, items } = req.body;

    const result = await createOrderUseCase({ customer_id, address_id, items });
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
};
