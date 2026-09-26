import Product from "../../../domain/entities/Product.js";

export default class CreateProduct {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(data) {
        const product = new Product(data);

        return await this.productRepository.create(product);
    }
}