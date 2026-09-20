import MySQLProductRepository from "../../infrastructure/database/repositories/MySQLProductRepository.js";

import CreateProduct from "../../application/usecases/products/CreateProduct.js";
import GetProducts from "../../application/usecases/products/GetProducts.js";
import GetProductById from "../../application/usecases/products/GetProductById.js";
import UpdateProduct from "../../application/usecases/products/UpdateProduct.js";
import DeleteProduct from "../../application/usecases/products/DeleteProduct.js";

const productRepository = new MySQLProductRepository();

const createProductUseCase = new CreateProduct(productRepository);
const getProductsUseCase = new GetProducts(productRepository);
const getProductByIdUseCase = new GetProductById(productRepository);
const updateProductUseCase = new UpdateProduct(productRepository);
const deleteProductUseCase = new DeleteProduct(productRepository);

export const getProducts = async (req, res) => {
    try {
        const categoryId = req.query.category_id ?? null;

        const products = await getProductsUseCase.execute(categoryId);

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdUseCase.execute(req.params.id);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        const status = error.message === "Producto no encontrado"
            ? 404
            : 400;

        res.status(status).json({
            success: false,
            error: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await createProductUseCase.execute(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await updateProductUseCase.execute(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        const status = error.message === "Producto no encontrado"
            ? 404
            : 400;

        res.status(status).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await deleteProductUseCase.execute(req.params.id);

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        const status = error.message === "Producto no encontrado"
            ? 404
            : 400;

        res.status(status).json({
            success: false,
            error: error.message
        });
    }
};