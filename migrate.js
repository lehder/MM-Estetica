import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  let connection;
  try {
    console.log('Conectando a Aiven...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'defaultdb',
      multipleStatements: true,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Leyendo init.sql...');
    let sql = fs.readFileSync('init.sql', 'utf8');

    // Quitar sentencias de base de datos local para ejecutar directamente en defaultdb
    sql = sql.replace(/CREATE DATABASE[\s\S]*?;/gi, '');
    sql = sql.replace(/USE [\s\S]*?;/gi, '');

    console.log('Creando tablas e insertando datos...');
    await connection.query(sql);

    console.log('¡Migración exitosa! Tabla services creada y poblada.');
  } catch (error) {
    console.error('Error en la migración:', error);
  } finally {
    if (connection) await connection.end();
  }
}

runMigration();