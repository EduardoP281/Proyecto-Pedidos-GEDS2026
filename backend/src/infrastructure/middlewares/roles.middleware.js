export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { message: 'Usuario no autenticado' } });
        }

        let userRole = req.user.role_name || req.user.role;
        // Forzamos la conversión a número para evitar fallos de texto vs número
        const roleId = Number(req.user.role_id || req.user.roleId);
        
        if (!userRole && roleId) {
            if (roleId === 1) userRole = 'client';
            if (roleId === 2) userRole = 'admin';
            if (roleId === 3) userRole = 'delivery';
        }

        if (allowedRoles.includes(userRole)) {
            return next();
        }

        return res.status(403).json({ success: false, error: { message: 'Permisos insuficientes.' } });
    };
};