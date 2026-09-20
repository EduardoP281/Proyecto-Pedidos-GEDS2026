export default class GetCategories {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute() {
        return await this.categoryRepository.findAll();
    }
}
