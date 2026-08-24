import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'SEc28*';
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded;
        next();
    } catch (error) {}
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};