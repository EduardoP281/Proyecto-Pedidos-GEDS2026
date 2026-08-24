import { Router } from 'express';
import { register, login } from '../../adapters/controllers/AuthController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/perfil', verifyToken, (req, res) => {
    res.json({ 
        mensaje: '¡Acceso concedido a la ruta protegida!', 
        usuario: req.user 
    });
});

export default router;