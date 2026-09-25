import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
  }),

  getters: {
    // Subtotal neto (sin IVA)
    subtotalSinIva: (state) => {
      return state.items.reduce((acc, item) => acc + (item.precioSinIva * item.cantidad), 0);
    },
    // Monto correspondiente al 13% de IVA exigido por RF-04
    montoIva: (state) => {
      return state.subtotalSinIva * 0.13;
    },
    // Total a pagar con IVA
    totalConIva: (state) => {
      return state.subtotalSinIva + state.montoIva;
    },
    // Cantidad total de artículos
    totalItemsCount: (state) => {
      return state.items.reduce((acc, item) => acc + item.cantidad, 0);
    },
  },

  actions: {
    syncStorage() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },

    addItem(product) {
      const existing = this.items.find((i) => i.id === product.id);
      const precioBase = Number(product.precio);

      if (existing) {
        if (existing.cantidad < product.stock) {
          existing.cantidad += 1;
        }
      } else {
        this.items.push({
          id: product.id,
          nombre: product.nombre,
          precioSinIva: precioBase,
          precioConIva: Number((precioBase * 1.13).toFixed(2)),
          cantidad: 1,
          stock: product.stock,
        });
      }
      this.syncStorage();
    },

    updateQuantity(productId, cantidad) {
      const item = this.items.find((i) => i.id === productId);
      if (item) {
        const qty = Number(cantidad);
        if (qty <= 0) {
          this.removeItem(productId);
        } else if (qty <= item.stock) {
          item.cantidad = qty;
          this.syncStorage();
        }
      }
    },

    removeItem(productId) {
      this.items = this.items.filter((i) => i.id !== productId);
      this.syncStorage();
    },

    clearCart() {
      this.items = [];
      localStorage.removeItem('cart_items');
    },
  },
});