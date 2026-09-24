import { registerUserUseCase } from '../../application/usecases/RegisterUser.js';
import { loginUserUseCase } from '../../application/usecases/LoginUser.js';

export const register = async (req, res, next) => {
    try {
        const result = await registerUserUseCase(req.body);
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await loginUserUseCase(req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return next(error);
    }
};
