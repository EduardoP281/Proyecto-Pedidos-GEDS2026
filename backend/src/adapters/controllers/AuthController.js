import { registerUserUseCase } from '../../application/usecases/RegisterUser.js';

export const register = async (req, res) => {
    try {
        const result = await registerUserUseCase(req.body);
        res.status(201).json(result);
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El correo o username ya está en uso." });
        }
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};