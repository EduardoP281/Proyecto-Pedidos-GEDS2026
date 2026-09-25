import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../../adapters/controllers/ProductController.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/roles.middleware.js';

const router = Router();

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/', verifyToken, authorizeRoles('admin'), createProduct);

router.put('/:id', verifyToken, authorizeRoles('admin'), updateProduct);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteProduct);

export default router;