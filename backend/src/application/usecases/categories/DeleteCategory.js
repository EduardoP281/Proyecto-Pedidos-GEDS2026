export default class DeleteCategory {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id) {
        const category =
            await this.categoryRepository.findById(id);

        if (!category) {
            throw new Error("Categoría no encontrada");
        }
        return await this.categoryRepository.delete(id);
    }
}