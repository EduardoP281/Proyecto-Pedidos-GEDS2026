import express from 'express';
import cors from 'cors';
import { createRepositories } from './infrastructure/repositories/repositoryFactory.js';
import { buildCatalogRoutes } from './api/routes/catalogRoutes.js';
import { buildOrderRoutes } from './api/routes/orderRoutes.js';
import errorHandler from './api/middleware/errorHandler.js';

export function createApp() {
  const app = express();
  const repositories = createRepositories();

  app.use(cors());
  app.use(express.json());

  app.get('/api/test', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api', buildCatalogRoutes(repositories));
  app.use('/api', buildOrderRoutes(repositories));

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Ruta no encontrada: ${req.originalUrl}`,
      },
    });
  });

  app.use(errorHandler);

  return app;
}

export default createApp();
