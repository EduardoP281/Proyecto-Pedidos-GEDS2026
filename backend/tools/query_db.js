import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || undefined
  });
  try {
    const [roles] = await connection.query('SELECT * FROM roles');
    const [users] = await connection.query('SELECT user_id, role_id, full_name, username, email FROM users');
    console.log('ROLES:', roles);
    console.log('USERS:', users);
  } catch (err) {
    console.error('Error consultando DB:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();