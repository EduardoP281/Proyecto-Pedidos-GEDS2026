import Category from "../../../domain/entities/Category.js";

export default class CreateCategory {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(data) {
        const category = new Category(data);

        return await this.categoryRepository.create(category);
    }
}