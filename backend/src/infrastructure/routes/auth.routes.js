import { Router } from 'express';
import { register } from '../../adapters/controllers/AuthController.js';

const router = Router();

router.post('/register', register);

export default router;