import Category from "../../../domain/entities/Category.js";

export default class UpdateCategory {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id, data) {
        const existingCategory =
            await this.categoryRepository.findById(id);

        if (!existingCategory) {
            throw new Error("Categoría no encontrada");
        }
        const category = new Category({
            category_id: existingCategory.category_id,
            name: data.name ?? existingCategory.name,
            description:
                data.description ?? existingCategory.description,
            image_url:
                data.image_url ?? existingCategory.image_url,
            is_active:
                data.is_active ?? existingCategory.is_active,
            created_at:
                existingCategory.created_at,
            updated_at:
                existingCategory.updated_at
        });
        return await this.categoryRepository.update(id, category);
    }
}