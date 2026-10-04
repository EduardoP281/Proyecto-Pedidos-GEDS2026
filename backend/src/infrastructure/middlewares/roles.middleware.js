export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error("authorizeRoles: req.user es indefinido.");
            return res.status(401).json({ success: false, error: { message: 'Usuario no autenticado' } });
        }

        console.log("authorizeRoles: Usuario autenticado. req.user:", req.user);

        // Intenta obtener el rol de todas las formas posibles
        let userRoleText = req.user.role_name || req.user.role;
        const roleId = Number(req.user.role_id || req.user.roleId || req.user.id_rol || req.user.rol);
        
        console.log(`authorizeRoles: Rol extraído. userRoleText: ${userRoleText}, roleId: ${roleId}`);

        // Traducción de roleId a texto si userRoleText no existe
        if (!userRoleText && !isNaN(roleId)) {
            if (roleId === 1) userRoleText = 'client';
            if (roleId === 2) userRoleText = 'admin';
            if (roleId === 3) userRoleText = 'delivery';
        }

        console.log(`authorizeRoles: Rol final evaluado: ${userRoleText}`);
        console.log(`authorizeRoles: Roles permitidos para esta ruta:`, allowedRoles);

        if (allowedRoles.includes(userRoleText)) {
            console.log("authorizeRoles: Acceso permitido.");
            return next();
        }

        console.warn(`authorizeRoles: Acceso denegado. Se esperaba uno de ${allowedRoles}, pero el usuario tiene ${userRoleText}`);
        return res.status(403).json({ success: false, error: { message: 'Permisos insuficientes.' } });
    };
};