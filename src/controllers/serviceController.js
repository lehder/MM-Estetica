import { pool } from '../config/db.js';

export const getServices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 6);
    const offset = (page - 1) * limit;
    const category = (req.query.category || '').toUpperCase().trim();

    let countQuery = 'SELECT COUNT(*) as total FROM services';
    let dataQuery = 'SELECT * FROM services';
    const params = [];

    if (category && (category === 'FACIAL' || category === 'CORPORAL')) {
      countQuery += ' WHERE category = ?';
      dataQuery += ' WHERE category = ?';
      params.push(category);
    }

    // Usar interpolación numérica segura para evitar errores de tipo en sentencias preparadas de MySQL
    dataQuery += ` ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`;

    const [countResult] = await pool.query(countQuery, params);
    const totalItems = countResult && countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const [rows] = await pool.query(dataQuery, params);

    return res.status(200).json({
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    // Imprime el error exacto en los logs de Render para depuración inmediata
    console.error('--- FALLO CRÍTICO EN getServices ---');
    console.error('Mensaje:', error.message);
    console.error('Código SQL:', error.code);
    console.error('Número de error:', error.errno);
    console.error('Stack:', error.stack);

    return res.status(500).json({
      message: 'Error interno al consultar servicios',
      error: error.message
    });
  }
};