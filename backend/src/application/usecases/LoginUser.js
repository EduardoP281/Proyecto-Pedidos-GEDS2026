import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../infrastructure/database/db.js';

export const loginUserUseCase = async (userData) => {
    const { email, password } = userData;

    // 1. Buscar al usuario por su correo
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
        throw new Error('Credenciales incorrectas');
    }

    const user = users[0];

    // 2. Comparar la contraseña ingresada con el hash de la base de datos
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
        throw new Error('Credenciales incorrectas');
    }

    // 3. Generar el Token de seguridad
    // Si no tienen JWT_SECRET en Railway, usará una clave por defecto para que no crashee
    const secret = process.env.JWT_SECRET || 'clave_secreta_provisional_123';
    
    // Asumimos que la llave primaria es user_id o id
    const userId = user.user_id || user.id;

    const token = jwt.sign(
        { id: userId, email: user.email, role_id: user.role_id }, 
        secret, 
        { expiresIn: '24h' }
    );

    // 4. Devolver la estructura exacta que espera tu store de Pinia en el frontend
    return {
        token,
        user: {
            id: userId,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            phone: user.phone
        }
    };
};