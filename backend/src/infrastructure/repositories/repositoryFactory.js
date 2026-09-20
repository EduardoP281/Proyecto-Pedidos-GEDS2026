import { config } from '../../config/environment.js';
import { SqliteConnection, SqliteCategoryRepository, SqliteProductRepository, SqliteOrderRepository, SqliteTransactionManager } from './sqliteRepositories.js';

export function createRepositories(options = {}) {
  const dbPath = options.dbPath ?? config.sqlite.path;
  const connection = new SqliteConnection(dbPath);
  const categoryRepository = new SqliteCategoryRepository(connection.db);
  const productRepository = new SqliteProductRepository(connection.db);
  const orderRepository = new SqliteOrderRepository(connection.db);
  const transactionManager = new SqliteTransactionManager(connection.db);

  return {
    categoryRepository,
    productRepository,
    orderRepository,
    transactionManager,
  };
}
