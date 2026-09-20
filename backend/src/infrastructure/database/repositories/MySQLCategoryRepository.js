import pool from "../db.js";
import CategoryRepository from "../../../application/repositories/CategoryRepository.js";
import Category from "../../../domain/entities/Category.js";

export default class MySQLCategoryRepository extends CategoryRepository {

    async findAll() {
        const [rows] = await pool.execute(`
            SELECT
                category_id,
                name,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM categories
            ORDER BY name
        `);

        return rows.map(row => new Category(row));
    }

    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT
                category_id,
                name,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM categories
            WHERE category_id = ?
        `, [id]);

        if (rows.length === 0) {
            return null;
        }

        return new Category(rows[0]);
    }

    async create(category) {
        const [result] = await pool.execute(`
            INSERT INTO categories (
                name,
                description,
                image_url,
                is_active
            )
            VALUES (?, ?, ?, ?)
        `, [
            category.name,
            category.description,
            category.image_url,
            category.is_active
        ]);

        return this.findById(result.insertId);
    }

    async update(id, category) {
        const [result] = await pool.execute(`
            UPDATE categories
            SET
                name = ?,
                description = ?,
                image_url = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE category_id = ?
        `, [
            category.name,
            category.description,
            category.image_url,
            category.is_active,
            id
        ]);

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.execute(`
            DELETE FROM categories
            WHERE category_id = ?
        `, [id]);

        return result.affectedRows > 0;
    }
}