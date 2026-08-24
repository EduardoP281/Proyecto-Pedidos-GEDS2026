import bcrypt from 'bcryptjs';
import pool from '../../infrastructure/database/db.js';

export const registerUserUseCase = async (userData) => {
    const { full_name, username, email, password, phone } = userData;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    let role_id;
    const [existingRoles] = await pool.query('SELECT role_id FROM roles LIMIT 1');
    if (existingRoles && existingRoles.length > 0) {
        role_id = existingRoles[0].role_id;
    } else {
        const [insertRole] = await pool.query('INSERT INTO roles (name, description) VALUES (?, ?)', ['cliente', 'Rol por defecto de cliente']);
        role_id = insertRole.insertId;
    }

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