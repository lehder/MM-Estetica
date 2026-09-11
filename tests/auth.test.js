import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';

describe('Pruebas del Módulo de Autenticación', () => {
  it('POST /api/auth/register debe rechazar datos incompletos con 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/login debe rechazar credenciales no registradas con 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'PasswordInvalido123!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  afterAll(async () => {
    await pool.end();
  });
});