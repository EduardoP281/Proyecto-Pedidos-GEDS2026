import { randomUUID } from 'node:crypto';
import { ORDER_STATUS, isValidTransition } from '../../domain/orderStatus.js';
import { ValidationError, DomainConflictError, NotFoundError } from '../../utils/errors.js';

const normalizeCustomerName = (payload) => payload?.customerName ?? payload?.customer_name ?? '';
const normalizeCustomerEmail = (payload) => payload?.customerEmail ?? payload?.customer_email ?? '';
const normalizeOrderItems = (payload) => {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
};

export async function listOrders(orderRepository) {
  return orderRepository.list();
}

export async function createOrder({ orderRepository, productRepository, transactionManager }, payload) {
  const customerName = normalizeCustomerName(payload).trim();
  const customerEmail = normalizeCustomerEmail(payload).trim();
  const items = normalizeOrderItems(payload);

  if (!customerName) {
    throw new ValidationError('El nombre del cliente es obligatorio.');
  }

  if (!customerEmail) {
    throw new ValidationError('El correo del cliente es obligatorio.');
  }

  if (items.length === 0) {
    throw new ValidationError('Debe indicar al menos un producto en el pedido.');
  }

  return transactionManager.withTransaction(async () => {
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = item?.productId ?? item?.product_id ?? item?.id;
      const quantity = Number(item?.quantity ?? item?.qty ?? 0);

      if (!productId) {
        throw new ValidationError('Cada producto del pedido requiere un identificador válido.');
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ValidationError('La cantidad de cada producto debe ser un entero mayor a 0.');
      }

      const product = await productRepository.getById(productId);

      if (!product) {
        throw new NotFoundError(`Producto ${productId} no encontrado.`);
      }

      if (product.stock < quantity) {
        throw new DomainConflictError(`No hay stock suficiente para ${product.name}.`);
      }

      const lineTotal = product.price * quantity;
      subtotal += lineTotal;

      processedItems.push({
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        lineTotal,
      });

      await productRepository.update({
        ...product,
        stock: product.stock - quantity,
        updatedAt: new Date().toISOString(),
      });
    }

    const iva = Number((subtotal * 0.13).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));

    const order = {
      id: randomUUID(),
      customerName,
      customerEmail,
      status: ORDER_STATUS.CREADO,
      subtotal: Number(subtotal.toFixed(2)),
      iva,
      total,
      items: processedItems,
      createdAt: new Date().toISOString(),
    };

    return orderRepository.create(order);
  });
}

export async function updateOrderStatus(orderRepository, orderId, nextStatus) {
  const order = await orderRepository.getById(orderId);

  if (!order) {
    throw new NotFoundError('Pedido no encontrado.');
  }

  if (!isValidTransition(order.status, nextStatus)) {
    throw new ValidationError(`No es posible actualizar el pedido de ${order.status} a ${nextStatus}.`);
  }

  return orderRepository.updateStatus(orderId, nextStatus);
}
