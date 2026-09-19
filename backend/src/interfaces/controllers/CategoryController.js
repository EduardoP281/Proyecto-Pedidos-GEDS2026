import { CategoryService } from '../../application/services/CategoryService.js';

export class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    async getAll(req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async getById(req, res) {
        try {
            const category = await this.categoryService.getCategoryById(req.params.id);
            if (!category) return res.status(404).json({ success: false, error: "Categoría no encontrada" });
            res.json({ success: true, data: category });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async create(req, res) {
        try {
            const newCategory = await this.categoryService.createCategory(req.body);
            res.status(201).json({ success: true, data: newCategory });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async update(req, res) {
        try {
            const updatedCategory = await this.categoryService.updateCategory(req.params.id, req.body);
            res.json({ success: true, data: updatedCategory });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }

    async delete(req, res) {
        try {
            await this.categoryService.deleteCategory(req.params.id);
            res.json({ success: true, message: "Categoría eliminada correctamente" });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, error: error.message || "Error interno del servidor" });
        }
    }
}
