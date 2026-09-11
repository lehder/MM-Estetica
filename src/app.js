import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '../public');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static(publicPath));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Vistas HTML principales
const views = ['index', 'contacto', 'servicios', 'login'];

views.forEach((view) => {
  const route = view === 'index' ? '/' : `/${view}`;
  app.get(route, (req, res) => {
    res.sendFile(path.join(publicPath, `${view}.html`));
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, 'index.html'));
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('--- ERROR CAPTURADO EN EL SERVIDOR ---');
  console.error('Mensaje:', err.message);
  console.error('Código:', err.code);
  console.error('Stack:', err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

export default app;