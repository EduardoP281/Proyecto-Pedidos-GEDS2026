import dotenv from 'dotenv';

dotenv.config();

const databaseMode = process.env.DB_MODE ?? (process.env.DB_HOST ? 'mysql' : 'sqlite');

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseMode,
  useMemoryDb: process.env.USE_MEMORY_DB === 'true' || databaseMode === 'sqlite',
  sqlite: {
    path: process.env.DB_PATH ?? './data/pedidos.db',
  },
  mysql: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME ?? 'pedidos_db',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  },
};
