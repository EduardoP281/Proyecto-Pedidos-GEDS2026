export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Acceso denegado.' });
        }

        const roleName = user.role_name || user.role || null;
        if (!allowedRoles.includes(roleName)) {
            return res.status(403).json({ error: 'Permisos insuficientes.' });
        }

        next();
    };
};
