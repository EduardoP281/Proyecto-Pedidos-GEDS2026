import { defineStore } from 'pinia';

const readCart = () => {
  try {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: readCart(),
  }),
  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    totalItemsCount: (state) => state.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    subtotalSinIva: (state) => state.items.reduce(
      (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
      0
    ),
    montoIva: (state) => Number((state.items.reduce(
      (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
      0
    ) * 0.13).toFixed(2)),
    totalConIva: (state) => Number((state.subtotalSinIva * 1.13).toFixed(2)),
    subtotal: (state) => state.subtotalSinIva,
    tax: (state) => state.montoIva,
    total: (state) => state.totalConIva,
    itemsWithPriceWithVAT: (state) => state.items.map((item) => ({
      ...item,
      priceWithVAT: Number((Number(item.product?.price || 0) * 1.13).toFixed(2)),
      priceWithoutVAT: Number(Number(item.product?.price || 0).toFixed(2)),
    })),
  },
  actions: {
    persist() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },
    addItem(product, quantity = 1) {
      if (!product) return false;

      const existing = this.items.find((item) => item.product.product_id === product.product_id);
      const qtyToAdd = Number(quantity) || 1;
      const stockLimit = Number(product.stock || 0);

      if (existing) {
        const newQty = existing.quantity + qtyToAdd;
        if (newQty > stockLimit) return false;
        existing.quantity = newQty;
      } else {
        if (qtyToAdd > stockLimit) return false;
        this.items.push({ product, quantity: qtyToAdd });
      }

      this.persist();
      return true;
    },
    removeItem(productId) {
      this.items = this.items.filter((item) => item.product.product_id !== productId);
      this.persist();
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find((entry) => entry.product.product_id === productId);
      if (!item) return false;

      const q = Number(quantity);
      if (!Number.isInteger(q) || q < 1) return false;
      if (q > Number(item.product.stock || 0)) return false;

      item.quantity = q;
      this.persist();
      return true;
    },
    clear() {
      this.items = [];
      this.persist();
    },
  },
});
