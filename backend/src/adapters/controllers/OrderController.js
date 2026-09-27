import { createOrderUseCase } from '../../application/usecases/orders/CreateOrder.js';
import pool from '../../infrastructure/database/db.js';

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

export const getMyOrders = async (req, res, next) => {
  try {
    const customer_id = req.user?.user_id;
    if (!customer_id) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    const [rows] = await pool.execute(
      `SELECT o.order_id, o.customer_id, o.address_id, o.status_id, os.name AS status_name,
              o.subtotal, o.delivery_fee, o.total, o.created_at
       FROM orders o
       LEFT JOIN order_status os ON os.status_id = o.status_id
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC`,
      [customer_id]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.order_id, o.customer_id, u.full_name AS customer_name, o.address_id,
              o.status_id, os.name AS status_name, o.subtotal, o.delivery_fee, o.total,
              o.created_at
       FROM orders o
       LEFT JOIN users u ON u.user_id = o.customer_id
       LEFT JOIN order_status os ON os.status_id = o.status_id
       ORDER BY o.created_at DESC`
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT o.order_id, o.customer_id, o.address_id, o.status_id, os.name AS status_name,
              o.subtotal, o.delivery_fee, o.total, o.created_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'product_id', od.product_id,
                  'quantity', od.quantity,
                  'unit_price', od.unit_price,
                  'subtotal', od.subtotal
                )
              ) AS items
       FROM orders o
       LEFT JOIN order_status os ON os.status_id = o.status_id
       LEFT JOIN order_details od ON od.order_id = o.order_id
       WHERE o.order_id = ?
       GROUP BY o.order_id`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, status_id } = req.body;

    let finalStatusId = status_id ?? null;
    if (!finalStatusId && status) {
      const [statusRows] = await pool.execute('SELECT status_id FROM order_status WHERE name = ?', [status]);
      if (!statusRows.length) {
        return res.status(400).json({ success: false, error: 'Estado inválido' });
      }
      finalStatusId = statusRows[0].status_id;
    }

    if (!finalStatusId) {
      return res.status(400).json({ success: false, error: 'Debe enviar un estado válido' });
    }

    const [result] = await pool.execute(
      'UPDATE orders SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [finalStatusId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }

    return res.status(200).json({ success: true, message: 'Estado del pedido actualizado' });
  } catch (err) {
    return next(err);
  }
};
