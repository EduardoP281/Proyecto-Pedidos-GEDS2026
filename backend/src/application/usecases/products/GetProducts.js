export default class GetProducts {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(categoryId = null) {
        return await this.productRepository.findAll(categoryId);
    }
}