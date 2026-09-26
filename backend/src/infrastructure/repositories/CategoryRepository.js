import pool from '../database/db.js';

export class CategoryRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM categories');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    async create(category) {
        const { name, description } = category;
        const [result] = await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        return { id: result.insertId, ...category };
    }

    async update(id, category) {
        const { name, description } = category;
        await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
        return { id, ...category };
    }

    async delete(id) {
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return true;
    }
}
