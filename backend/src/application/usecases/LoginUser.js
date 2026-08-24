import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../infrastructure/database/db.js';

export const loginUserUseCase = async (userData) => {
    const { email, password } = userData;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
        throw new Error('Credenciales incorrectas');
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
        throw new Error('Credenciales incorrectas');
    }

    const secret = process.env.JWT_SECRET || 'clave_secreta_provisional_123';
    
    const userId = user.user_id || user.id;

    const token = jwt.sign(
        { id: userId, email: user.email, role_id: user.role_id }, 
        secret, 
        { expiresIn: '24h' }
    );

    return {
        token,
        user: {
            id: userId,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            phone: user.phone,
            role_id: user.role_id
        }
    };
};