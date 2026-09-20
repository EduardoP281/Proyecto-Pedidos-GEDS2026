import { Router } from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../adapters/controllers/CategoryController.js';

import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getCategories);

router.post('/', verifyToken, createCategory);

router.put('/:id', verifyToken, updateCategory);

router.delete('/:id', verifyToken, deleteCategory);

export default router;