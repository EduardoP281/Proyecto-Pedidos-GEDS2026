import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sql = fs.readFileSync(new URL('../db_schema.sql', import.meta.url), 'utf8');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
  try {
    console.log('Ejecutando script SQL...');
    await connection.query(sql);
    console.log('Importación SQL completada.');
  } catch (err) {
    console.error('Error importando SQL:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();