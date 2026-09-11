import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Si corre dentro del contenedor Docker (DB_HOST=db), el puerto interno siempre es 3306
const isDocker = process.env.DB_HOST === 'db';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: isDocker ? 3306 : Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'melanie_marin_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});