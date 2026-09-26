import api from './api';

export const ordersService = {
  createOrder(orderData) {
    return api.post('/orders', orderData);
  },

  getMyOrders() {
    return api.get('/orders/my-orders');
  },

  getOrderById(id) {
    return api.get(`/orders/${id}`);
  },


  getAllOrders(filters = {}) {
    return api.get('/orders', { params: filters });
  },

  updateOrderStatus(id, nuevoEstado) {
    return api.patch(`/orders/${id}/status`, { estado: nuevoEstado });
  },
};