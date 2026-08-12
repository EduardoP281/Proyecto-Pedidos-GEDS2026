import bcrypt from 'bcryptjs';
import pool from '../../infrastructure/database/db.js';

export const registerUserUseCase = async (userData) => {
    const { full_name, username, email, password, phone } = userData;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const role_id = 1;

    const query = `
        INSERT INTO users (role_id, full_name, username, email, password_hash, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [role_id, full_name, username, email, password_hash, phone]);
    
    return {
        user_id: result.insertId,
        full_name,
        email,
        message: "Usuario registrado correctamente"
    };
};