import { Router } from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../adapters/controllers/CategoryController.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/roles.middleware.js';

const router = Router();

router.get('/', getCategories);

router.post('/', verifyToken, authorizeRoles('admin'), createCategory);

router.put('/:id', verifyToken, authorizeRoles('admin'), updateCategory);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCategory);

export default router;