import pool from '../db.js';

export default class MySQLOrderRepository {

  async createOrderTransactional({ customer_id, address_id, items }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      const err = new Error('No hay items en la orden');
      err.statusCode = 400; err.isDomain = true;
      throw err;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Ensure order_status 'CREADO' exists
      const [statusRows] = await connection.execute('SELECT status_id FROM order_status WHERE name = ?', ['CREADO']);
      let statusId;
      if (statusRows.length > 0) statusId = statusRows[0].status_id;
      else {
        const [ins] = await connection.execute('INSERT INTO order_status (name, description) VALUES (?,?)', ['CREADO','Estado inicial']);
        statusId = ins.insertId;
      }

      // Check stock for each item with FOR UPDATE
      for (const it of items) {
        const [rows] = await connection.execute('SELECT stock FROM products WHERE product_id = ? FOR UPDATE', [it.product_id]);
        if (rows.length === 0) {
          const err = new Error(`Producto ${it.product_id} no encontrado`); err.statusCode = 404; err.isDomain = true; throw err;
        }
        const stock = Number(rows[0].stock || 0);
        if (stock < it.quantity) {
          const err = new Error(`Stock insuficiente para producto ${it.product_id}`); err.statusCode = 409; err.isDomain = true; throw err;
        }
      }

      // Compute subtotal (without IVA)
      let subtotal = 0.0;
      for (const it of items) {
        subtotal += Number(it.unit_price) * Number(it.quantity);
      }
      subtotal = Number(subtotal.toFixed(2));
      const total = Number((subtotal * 1.13).toFixed(2));

      const [orderRes] = await connection.execute(
        `INSERT INTO orders (customer_id, address_id, status_id, subtotal, delivery_fee, total) VALUES (?,?,?,?,?,?)`,
        [customer_id, address_id, statusId, subtotal, 0.00, total]
      );

      const orderId = orderRes.insertId;

      // Insert order details and decrement stock
      for (const it of items) {
        const unitPrice = Number(it.unit_price);
        const qty = Number(it.quantity);
        const lineSubtotal = Number((unitPrice * qty).toFixed(2));

        await connection.execute(
          `INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal) VALUES (?,?,?,?,?)`,
          [orderId, it.product_id, qty, unitPrice, lineSubtotal]
        );

        await connection.execute(`UPDATE products SET stock = stock - ? WHERE product_id = ?`, [qty, it.product_id]);
      }

      await connection.commit();

      return { order_id: orderId, subtotal, total };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

}
