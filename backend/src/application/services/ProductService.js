import { ProductRepository } from '../../infrastructure/repositories/ProductRepository.js';

export class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(categoryId) {
        if (categoryId) {
            return await this.productRepository.findByCategoryId(categoryId);
        }
        return await this.productRepository.findAll();
    }

    async getProductById(id) {
        return await this.productRepository.findById(id);
    }

    async createProduct(productData) {
        if (productData.price <= 0) {
            throw { status: 400, message: "El precio debe ser mayor a 0." };
        }
        if (productData.stock < 0) {
            throw { status: 400, message: "El stock debe ser mayor o igual a 0." };
        }
        return await this.productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        if (productData.price <= 0) {
            throw { status: 400, message: "El precio debe ser mayor a 0." };
        }
        if (productData.stock < 0) {
            throw { status: 400, message: "El stock debe ser mayor o igual a 0." };
        }
        return await this.productRepository.update(id, productData);
    }

    async deleteProduct(id) {
        return await this.productRepository.delete(id);
    }
}
