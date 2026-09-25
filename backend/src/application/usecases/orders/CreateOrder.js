import MySQLOrderRepository from '../../../infrastructure/database/repositories/MySQLOrderRepository.js';

const repo = new MySQLOrderRepository();

export const createOrderUseCase = async ({ customer_id, address_id, items }) => {
  if (!customer_id) {
    const err = new Error('customer_id es requerido'); err.statusCode = 400; err.isDomain = true; throw err;
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    const err = new Error('items es requerido'); err.statusCode = 400; err.isDomain = true; throw err;
  }

  const result = await repo.createOrderTransactional({ customer_id, address_id, items });
  return result;
};
