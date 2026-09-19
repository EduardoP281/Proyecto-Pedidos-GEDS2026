import pool from '../database/db.js';

export class ProductRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM products');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    async findByCategoryId(categoryId) {
        const [rows] = await pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
        return rows;
    }

    async create(product) {
        const { name, description, price, stock, category_id, image_url } = product;
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)', 
            [name, description, price, stock, category_id, image_url]
        );
        return { id: result.insertId, ...product };
    }

    async update(id, product) {
        const { name, description, price, stock, category_id, image_url } = product;
        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?', 
            [name, description, price, stock, category_id, image_url, id]
        );
        return { id, ...product };
    }

    async delete(id) {
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return true;
    }
}
