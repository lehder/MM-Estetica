import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  let connection;
  try {
    console.log('Conectando a la base de datos remota...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Leyendo init.sql...');
    let sql = fs.readFileSync('init.sql', 'utf8');

    // Quitar comandos de crear/usar base de datos para no colisionar con defaultdb
    sql = sql.replace(/CREATE DATABASE[\s\S]*?;/i, '');
    sql = sql.replace(/USE [\s\S]*?;/i, '');

    console.log('Ejecutando tablas y datos...');
    await connection.query(sql);

    console.log('¡Migración completada con éxito! Tablas y tratamientos insertados.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    if (connection) await connection.end();
  }
}

runMigration();