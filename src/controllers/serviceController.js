import { pool } from '../config/db.js';

export const getServices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const category = req.query.category || '';

    let countQuery = 'SELECT COUNT(*) as total FROM services';
    let dataQuery = 'SELECT * FROM services';
    const params = [];

    if (category && (category === 'FACIAL' || category === 'CORPORAL')) {
      countQuery += ' WHERE category = ?';
      dataQuery += ' WHERE category = ?';
      params.push(category);
    }

    dataQuery += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    const dataParams = [...params, limit, offset];

    const [countResult] = await pool.query(countQuery, params);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await pool.query(dataQuery, dataParams);

    res.status(200).json({
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno al consultar servicios', error: error.message });
  }
};