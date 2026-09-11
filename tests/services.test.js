import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';

describe('Pruebas de Servicios y Archivos Estáticos', () => {
  it('GET /api/services debe responder 200 y devolver la estructura de paginación', async () => {
    const res = await request(app).get('/api/services?page=1&limit=6');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /servicios.html debe servir el archivo HTML estático', async () => {
    const res = await request(app).get('/servicios.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Melanie Marin');
  });

  it('GET /api/no-existe debe responder con error 404', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await pool.end();
  });
});