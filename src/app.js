import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir la carpeta public estática (un nivel arriba de /src)
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// Rutas explícitas de respaldo para las vistas HTML principales
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(path.join(publicPath, 'contacto.html'));
});

app.get('/servicios', (req, res) => {
  res.sendFile(path.join(publicPath, 'servicios.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Middleware global para imprimir el error exacto en los logs de Render
app.use((err, req, res, next) => {
  console.error('--- ERROR CAPTURADO EN EL SERVIDOR ---');
  console.error('Mensaje:', err.message);
  console.error('Código:', err.code);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

export default app;