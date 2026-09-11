import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST || 'localhost';
// Solo es entorno local sin SSL si apunta a localhost o al servicio interno de docker compose
const isLocal = host === 'localhost' || host === '127.0.0.1' || host === 'db';

export const pool = mysql.createPool({
  host: host,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'melanie_marin_db',
  // Obligatorio para MySQL en la nube (Aiven, Clever Cloud, etc.)
  ssl: !isLocal ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});