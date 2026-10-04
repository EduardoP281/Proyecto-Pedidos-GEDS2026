export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { message: 'Usuario no autenticado' } });
        }

        const roleId = Number(req.user.role_id);
        let normalizedRole = '';

        // Estandarizamos el rol según el ID para que coincida con las rutas
        if (roleId === 1) normalizedRole = 'client';
        if (roleId === 2) normalizedRole = 'admin';
        if (roleId === 3) normalizedRole = 'repartidor';

        // Si por alguna razón no hay roleId, revisamos el texto como respaldo
        if (!normalizedRole && req.user.role_name) {
            const roleName = req.user.role_name.toLowerCase();
            if (roleName === 'administrador') normalizedRole = 'admin';
            else if (roleName === 'cliente') normalizedRole = 'client';
            else normalizedRole = roleName;
        }

        if (allowedRoles.includes(normalizedRole)) {
            return next();
        }

        return res.status(403).json({ success: false, error: { message: 'Permisos insuficientes.' } });
    };
};