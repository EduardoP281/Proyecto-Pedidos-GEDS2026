import Product from "../../../domain/entities/Product.js";

export default class UpdateProduct {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(id, data) {
        const existingProduct =
            await this.productRepository.findById(id);

        if (!existingProduct) {
            throw new Error("Producto no encontrado");
        }
        const product = new Product({
            product_id: existingProduct.product_id,
            category_id:
                data.category_id ?? existingProduct.category_id,
            name:
                data.name ?? existingProduct.name,
            description:
                data.description ?? existingProduct.description,
            image_url:
                data.image_url ?? existingProduct.image_url,
            price:
                data.price ?? existingProduct.price,
            stock:
                data.stock ?? existingProduct.stock,
            is_available:
                data.is_available ?? existingProduct.is_available,
            created_at:
                existingProduct.created_at,
            updated_at:
                existingProduct.updated_at
        });
        return await this.productRepository.update(id, product);
    }
}