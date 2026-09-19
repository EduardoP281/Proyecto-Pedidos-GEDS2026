import pool from "../db.js";
import ProductRepository from "../../../application/repositories/ProductRepository.js";
import Product from "../../../domain/entities/Product.js";

export default class MySQLProductRepository extends ProductRepository {

    async findAll(categoryId = null) {
        let query = `
            SELECT
                product_id,
                category_id,
                name,
                description,
                image_url,
                price,
                stock,
                is_available,
                created_at,
                updated_at
            FROM products
        `;

        const params = [];

        if (categoryId) {
            query += ` WHERE category_id = ?`;
            params.push(categoryId);
        }

        query += ` ORDER BY name`;

        const [rows] = await pool.execute(query, params);

        return rows.map(row => new Product(row));
    }

    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT
                product_id,
                category_id,
                name,
                description,
                image_url,
                price,
                stock,
                is_available,
                created_at,
                updated_at
            FROM products
            WHERE product_id = ?
        `, [id]);

        if (rows.length === 0) {
            return null;
        }

        return new Product(rows[0]);
    }

    async create(product) {
        const [result] = await pool.execute(`
            INSERT INTO products (
                category_id,
                name,
                description,
                image_url,
                price,
                stock,
                is_available
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            product.category_id,
            product.name,
            product.description,
            product.image_url,
            product.price,
            product.stock,
            product.is_available
        ]);

        return this.findById(result.insertId);
    }

    async update(id, product) {
        const [result] = await pool.execute(`
            UPDATE products
            SET
                category_id = ?,
                name = ?,
                description = ?,
                image_url = ?,
                price = ?,
                stock = ?,
                is_available = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = ?
        `, [
            product.category_id,
            product.name,
            product.description,
            product.image_url,
            product.price,
            product.stock,
            product.is_available,
            id
        ]);

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.execute(`
            DELETE FROM products
            WHERE product_id = ?
        `, [id]);

        return result.affectedRows > 0;
    }
}