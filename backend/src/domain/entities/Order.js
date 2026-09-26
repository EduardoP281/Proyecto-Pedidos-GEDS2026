export default class Order {
    constructor({ order_id = null, customer_id, address_id, status = 'CREADO', subtotal = 0.0, total = 0.0, items = [] } = {}) {
        this.order_id = order_id;
        this.customer_id = customer_id;
        this.address_id = address_id;
        this.status = status; // one of: CREADO, PAGADO, EN_PREPARACION, EN_CAMINO, ENTREGADO, CANCELADO
        this.subtotal = Number(subtotal);
        this.total = Number(total);
        this.items = items; // array of { product_id, quantity, unit_price }
    }

    static allowedTransitions() {
        return {
            CREADO: ['PAGADO', 'CANCELADO'],
            PAGADO: ['EN_PREPARACION', 'CANCELADO'],
            EN_PREPARACION: ['EN_CAMINO', 'CANCELADO'],
            EN_CAMINO: ['ENTREGADO', 'CANCELADO'],
            ENTREGADO: [],
            CANCELADO: []
        };
    }

    canTransitionTo(next) {
        const map = Order.allowedTransitions();
        const allowed = map[this.status] || [];
        return allowed.includes(next);
    }

    transitionTo(next) {
        if (!this.canTransitionTo(next)) {
            throw new Error(`Transición inválida: ${this.status} -> ${next}`);
        }
        this.status = next;
    }
}
