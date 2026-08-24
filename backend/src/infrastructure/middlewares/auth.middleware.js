import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // 1. Buscamos el token en la cabecera (header) de la petición
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separa "Bearer" del "token_como_tal"

    // Si no hay token, bloqueamos el paso con un error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // 2. Intentamos verificar si el token es válido y no ha expirado
        const secret = process.env.JWT_SECRET || 'clave_secreta_provisional_123';
        const decoded = jwt.verify(token, secret);
        
        // 3. Si es válido, guardamos los datos del usuario y dejamos pasar la petición
        req.user = decoded;
        next();
    } catch (error) {
        // Si el token es falso o expiró, bloqueamos con un 403 (Prohibido)
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};