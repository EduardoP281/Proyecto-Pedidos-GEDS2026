export default class Product {
    constructor({
        product_id = null,
        category_id = null,
        name,
        description = null,
        image_url = null,
        price,
        stock = 0,
        is_available = true,
        created_at = null,
        updated_at = null
    }) {
        if (!name || !name.trim()) {
            throw new Error('El nombre del producto es obligatorio');
        }

        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            throw new Error('El precio debe ser mayor que 0');
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            throw new Error('El stock debe ser un número entero mayor o igual a 0');
        }

        this.product_id = product_id;
        this.category_id = category_id;
        this.name = name.trim();
        this.description = description;
        this.image_url = image_url;
        this.price = parsedPrice;
        this.stock = parsedStock;
        this.is_available = is_available;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}