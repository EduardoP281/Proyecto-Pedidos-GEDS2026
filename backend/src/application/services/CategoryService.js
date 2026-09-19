import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository.js';

export class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async getAllCategories() {
        return await this.categoryRepository.findAll();
    }

    async getCategoryById(id) {
        return await this.categoryRepository.findById(id);
    }

    async createCategory(categoryData) {
        if (!categoryData.name) {
            throw { status: 400, message: "El nombre de la categoría es requerido." };
        }
        return await this.categoryRepository.create(categoryData);
    }

    async updateCategory(id, categoryData) {
        if (!categoryData.name) {
            throw { status: 400, message: "El nombre de la categoría es requerido." };
        }
        return await this.categoryRepository.update(id, categoryData);
    }

    async deleteCategory(id) {
        return await this.categoryRepository.delete(id);
    }
}
