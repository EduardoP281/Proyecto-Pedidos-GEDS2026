export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Verificar que el usuario exista en la petición (inyectado por verifyToken)
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                error: { message: 'Usuario no autenticado' } 
            });
        }

        // 2. Extraer el rol del token (ya sea que venga como texto o como ID numérico)
        let userRole = req.user.role_name || req.user.role;
        
        // 3. Si el token solo trae el ID numérico, lo traducimos al texto correspondiente
        if (!userRole && req.user.role_id) {
            if (req.user.role_id === 1) userRole = 'client';
            if (req.user.role_id === 2) userRole = 'admin';
            if (req.user.role_id === 3) userRole = 'delivery'; // Repartidor
        }

        // 4. Verificar si el rol del usuario está dentro de los permitidos por la ruta
        if (allowedRoles.includes(userRole)) {
            return next();
        }

        // 5. Rechazar si no coincide (Envelope Pattern RNF-08)
        return res.status(403).json({ 
            success: false, 
            error: { message: 'Permisos insuficientes.' } 
        });
    };
};