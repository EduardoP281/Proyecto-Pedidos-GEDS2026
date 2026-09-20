import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { CategoryRepository, ProductRepository, OrderRepository } from '../../application/contracts/repositories.js';

const resolveDbPath = (dbPath) => {
  if (!dbPath || dbPath === ':memory:') {
    return ':memory:';
  }

  const filePath = dbPath ?? './data/pedidos.db';
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  return absolutePath;
};

export class SqliteConnection {
  constructor(dbPath) {
    this.dbPath = resolveDbPath(dbPath);
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initialize();
  }

  initialize() {
    const schema = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category_id TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        status TEXT NOT NULL,
        subtotal REAL NOT NULL,
        iva REAL NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `;

    this.db.exec(schema);
  }
}

export class SqliteCategoryRepository extends CategoryRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return this.db.prepare('SELECT * FROM categories ORDER BY created_at DESC').all().map((row) => ({
      ...row,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getById(id) {
    const item = this.db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!item) return null;

    return {
      ...item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }

  create(category) {
    this.db.prepare(
      'INSERT INTO categories (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)' 
    ).run(category.id, category.name, category.createdAt ?? new Date().toISOString(), category.updatedAt ?? null);
    return this.getById(category.id);
  }

  update(category) {
    const result = this.db.prepare(
      'UPDATE categories SET name = ?, updated_at = ? WHERE id = ?'
    ).run(category.name, category.updatedAt ?? new Date().toISOString(), category.id);

    if (result.changes === 0) return null;
    return this.getById(category.id);
  }

  remove(id) {
    const result = this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export class SqliteProductRepository extends ProductRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return this.db.prepare('SELECT * FROM products ORDER BY created_at DESC').all().map((row) => ({
      ...row,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  listByCategory(categoryId) {
    return this.db.prepare('SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC').all(categoryId).map((row) => ({
      ...row,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getById(id) {
    const item = this.db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!item) return null;

    return {
      ...item,
      categoryId: item.category_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }

  create(product) {
    this.db.prepare(
      'INSERT INTO products (id, name, description, category_id, price, stock, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' 
    ).run(
      product.id,
      product.name,
      product.description ?? '',
      product.categoryId,
      Number(product.price),
      Number(product.stock),
      product.createdAt ?? new Date().toISOString(),
      product.updatedAt ?? null,
    );
    return this.getById(product.id);
  }

  update(product) {
    const result = this.db.prepare(
      'UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock = ?, updated_at = ? WHERE id = ?'
    ).run(
      product.name,
      product.description ?? '',
      product.categoryId,
      Number(product.price),
      Number(product.stock),
      product.updatedAt ?? new Date().toISOString(),
      product.id,
    );

    if (result.changes === 0) return null;
    return this.getById(product.id);
  }

  remove(id) {
    const result = this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export class SqliteOrderRepository extends OrderRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return this.db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all().map((row) => ({
      ...row,
      items: JSON.parse(row.items),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getById(id) {
    const item = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!item) return null;

    return {
      ...item,
      items: JSON.parse(item.items),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }

  create(order) {
    this.db.prepare(
      'INSERT INTO orders (id, customer_name, customer_email, status, subtotal, iva, total, items, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      order.id,
      order.customerName,
      order.customerEmail,
      order.status,
      Number(order.subtotal),
      Number(order.iva),
      Number(order.total),
      JSON.stringify(order.items ?? []),
      order.createdAt ?? new Date().toISOString(),
      order.updatedAt ?? null,
    );
    return this.getById(order.id);
  }

  updateStatus(id, nextStatus) {
    const result = this.db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(nextStatus, new Date().toISOString(), id);
    if (result.changes === 0) return null;
    return this.getById(id);
  }
}

export class SqliteTransactionManager {
  constructor(db) {
    this.db = db;
  }

  async withTransaction(callback) {
    const begin = this.db.prepare('BEGIN IMMEDIATE');
    const commit = this.db.prepare('COMMIT');
    const rollback = this.db.prepare('ROLLBACK');

    begin.run();
    try {
      const result = await callback();
      commit.run();
      return result;
    } catch (error) {
      try {
        rollback.run();
      } catch {
        // ignore rollback errors
      }
      throw error;
    }
  }
}
