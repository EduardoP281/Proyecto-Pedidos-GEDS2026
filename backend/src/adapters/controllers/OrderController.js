import { createOrderUseCase } from '../../application/usecases/orders/CreateOrder.js';
import pool from '../../infrastructure/database/db.js';
import Order from '../../domain/entities/Order.js';

const normalizeOrderItems = (items = []) =>
  items.map((item) => ({
    product_id: item.product_id ?? item.productId ?? item.id ?? item.product?.product_id,
    quantity: Number(item.quantity ?? item.cantidad ?? 1),
    unit_price: Number(item.unit_price ?? item.precioSinIva ?? item.price ?? item.product?.price ?? 0),
  }));

const mapOrderRow = (row) => ({
  id: row.order_id ?? row.id,
  customer_id: row.customer_id ?? null,
  address_id: row.address_id ?? null,
  status_id: row.status_id ?? null,
  estado: row.status_name ?? row.estado ?? 'CREADO',
  status_name: row.status_name ?? row.estado ?? 'CREADO',
  subtotal: Number(row.subtotal ?? 0),
  delivery_fee: Number(row.delivery_fee ?? 0),
  total: Number(row.total ?? 0),
  createdAt: row.created_at ?? row.createdAt ?? null,
  created_at: row.created_at ?? row.createdAt ?? null,
  direccionEntrega: row.address_line ?? row.direccionEntrega ?? row.direccion_entrega ?? null,
  telefonoContacto: row.phone ?? row.telefonoContacto ?? row.telefono ?? null,
  items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : (row.items || []),
});

export const createOrder = async (req, res, next) => {
  try {
    const user = req.user || {};
    const body = req.body || {};
    const customer_id = user.user_id || body.customer_id || null;
    if (!customer_id) {
      return res.status(400).json({ success: false, error: 'customer_id es requerido' });
    }

    let address_id = body.address_id ?? null;
    if (!address_id && (body.direccionEntrega || body.address_line || body.direccion)) {
      const addressLine = body.direccionEntrega || body.address_line || 'Dirección principal';
      const city = body.city || 'San Salvador';
      const department = body.department || 'San Salvador';
      const phone = body.telefonoContacto || body.phone || user.phone || '00000000';

      const [addressResult] = await pool.execute(
        `INSERT INTO customer_addresses (user_id, address_line, city, department, postal_code, reference_point, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [customer_id, addressLine, city, department, body.postal_code || '', body.reference_point || '', 1]
      );

      address_id = addressResult.insertId;

      if (!user.phone && phone) {
        await pool.execute('UPDATE users SET phone = ? WHERE user_id = ?', [phone, customer_id]);
      }
    }

    const normalizedItems = normalizeOrderItems(body.items || []);
    const result = await createOrderUseCase({ customer_id, address_id, items: normalizedItems, notes: body.notes || null });

    return res.status(201).json({
      success: true,
      data: {
        id: result.order_id ?? result.id,
        order_id: result.order_id ?? result.id,
        subtotal: result.subtotal,
        total: result.total,
      },
    });
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
              o.subtotal, o.delivery_fee, o.total, o.created_at, ca.address_line, u.phone
       FROM orders o
       LEFT JOIN order_status os ON os.status_id = o.status_id
       LEFT JOIN customer_addresses ca ON ca.address_id = o.address_id
       LEFT JOIN users u ON u.user_id = o.customer_id
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC`,
      [customer_id]
    );

    return res.status(200).json({ success: true, data: rows.map(mapOrderRow) });
  } catch (err) {
    return next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.order_id, o.customer_id, u.full_name AS customer_name, o.address_id,
              o.status_id, os.name AS status_name, o.subtotal, o.delivery_fee, o.total,
              o.created_at, ca.address_line, u.phone
       FROM orders o
       LEFT JOIN users u ON u.user_id = o.customer_id
       LEFT JOIN customer_addresses ca ON ca.address_id = o.address_id
       LEFT JOIN order_status os ON os.status_id = o.status_id
       ORDER BY o.created_at DESC`
    );

    return res.status(200).json({ success: true, data: rows.map(mapOrderRow) });
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

    return res.status(200).json({ success: true, data: mapOrderRow(rows[0]) });
  } catch (err) {
    return next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Capturar el estado, quitar espacios en blanco y forzar mayúsculas
    const rawStatus = req.body.status ?? req.body.estado;
    if (!rawStatus) {
      const err = new Error('No se envió el nuevo estado'); err.statusCode = 400; throw err;
    }
    const requestedStatus = rawStatus.trim().toUpperCase();

    // 2. Obtener la orden actual (forzando su estado a mayúsculas para la entidad)
    const [orderRows] = await pool.execute(
      `SELECT o.order_id, UPPER(os.name) AS status_name 
       FROM orders o 
       JOIN order_status os ON o.status_id = os.status_id 
       WHERE o.order_id = ?`, 
      [id]
    );

    if (!orderRows.length) {
      const err = new Error('Pedido no encontrado'); err.statusCode = 404; throw err;
    }

    const currentStatus = orderRows[0].status_name;

    // 3. MÁQUINA DE ESTADOS (RF-06): Validar transición estrictamente
    const orderEntity = new Order({ status: currentStatus });
    orderEntity.transitionTo(requestedStatus); 

    // 4. Obtener el ID del nuevo estado ignorando mayúsculas/minúsculas en la BD
    const [statusRows] = await pool.execute(
      'SELECT status_id FROM order_status WHERE UPPER(name) = ?', 
      [requestedStatus]
    );
    
    if (!statusRows.length) {
      const err = new Error(`Estado '${requestedStatus}' no existe en la tabla order_status`); err.statusCode = 400; throw err;
    }

    // 5. Actualizar la base de datos
    await pool.execute(
      'UPDATE orders SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [statusRows[0].status_id, id]
    );

    return res.status(200).json({ success: true, message: `Estado actualizado a ${requestedStatus}` });
  } catch (err) {
    // Clasificar el error para el Envelope Pattern (RNF-08)
    if (err.message.includes('Transición inválida') || err.message.includes('Estado')) {
      err.isDomain = true;
      err.statusCode = 400;
    }
    return next(err);
  }
};