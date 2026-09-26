import { ProductService } from '../../application/services/ProductService.js';

export class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getAll(req, res) {
        try {
            const categoryId = req.query.category_id;
            const products = await this.productService.getAllProducts(categoryId);
            res.json({ success: true, data: products });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async getById(req, res) {
        try {
            const product = await this.productService.getProductById(req.params.id);
            if (!product) return res.status(404).json({ success: false, error: "Producto no encontrado" });
            res.json({ success: true, data: product });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async create(req, res) {
        try {
            const newProduct = await this.productService.createProduct(req.body);
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async update(req, res) {
        try {
            const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data: updatedProduct });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async delete(req, res) {
        try {
            await this.productService.deleteProduct(req.params.id);
            res.json({ success: true, message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }
}
