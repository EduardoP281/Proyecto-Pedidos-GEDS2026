import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]')
  }),
  getters: {
    itemCount: (state) => state.items.reduce((s, it) => s + it.quantity, 0),
    subtotal: (state) => state.items.reduce((s, it) => s + it.product.price * it.quantity, 0),
    tax: (state) => Number((state.items.reduce((s, it) => s + it.product.price * it.quantity, 0) * 0.13).toFixed(2)),
    total: (state) => Number((state.items.reduce((s, it) => s + it.product.price * it.quantity, 0) * 1.13).toFixed(2)),
    itemsWithPriceWithVAT: (state) => state.items.map(it => ({
      ...it,
      priceWithVAT: Number((it.product.price * 1.13).toFixed(2)),
      priceWithoutVAT: Number(it.product.price.toFixed(2))
    }))
  },
  actions: {
    persist() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },
    addItem(product, quantity = 1) {
      if (!product) return false;
      const existing = this.items.find(i => i.product.product_id === product.product_id);
      const qtyToAdd = Number(quantity) || 1;
      if (existing) {
        const newQty = existing.quantity + qtyToAdd;
        if (newQty > product.stock) return false;
        existing.quantity = newQty;
      } else {
        if (qtyToAdd > product.stock) return false;
        this.items.push({ product, quantity: qtyToAdd });
      }
      this.persist();
      return true;
    },
    removeItem(productId) {
      this.items = this.items.filter(i => i.product.product_id !== productId);
      this.persist();
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.product.product_id === productId);
      if (!item) return false;
      const q = Number(quantity);
      if (!Number.isInteger(q) || q < 1) return false;
      if (q > item.product.stock) return false;
      item.quantity = q;
      this.persist();
      return true;
    },
    clear() {
      this.items = [];
      this.persist();
    }
  }
});
