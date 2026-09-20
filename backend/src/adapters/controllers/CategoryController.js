import MySQLCategoryRepository from "../../infrastructure/database/repositories/MySQLCategoryRepository.js";

import CreateCategory from "../../application/usecases/categories/CreateCategory.js";
import GetCategories from "../../application/usecases/categories/GetCategories.js";
import UpdateCategory from "../../application/usecases/categories/UpdateCategory.js";
import DeleteCategory from "../../application/usecases/categories/DeleteCategory.js";

const categoryRepository = new MySQLCategoryRepository();

const createCategoryUseCase = new CreateCategory(categoryRepository);
const getCategoriesUseCase = new GetCategories(categoryRepository);
const updateCategoryUseCase = new UpdateCategory(categoryRepository);
const deleteCategoryUseCase = new DeleteCategory(categoryRepository);

export const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesUseCase.execute();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = await createCategoryUseCase.execute(req.body);

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await updateCategoryUseCase.execute(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        const status = error.message === "Categoría no encontrada"
            ? 404
            : 400;

        res.status(status).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await deleteCategoryUseCase.execute(req.params.id);

        res.status(200).json({
            success: true,
            message: "Categoría eliminada correctamente"
        });
    } catch (error) {
        const status = error.message === "Categoría no encontrada"
            ? 404
            : 400;

        res.status(status).json({
            success: false,
            error: error.message
        });
    }
};