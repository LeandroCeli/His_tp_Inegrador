// controllers/admin/solicitudController.js
const { SolicitudRegistro } = require('../models');

const getPendientes = async (req, res) => {
  try {
    const pendientes = await SolicitudRegistro.findAll();
    res.render('admin/pendientes', { pendientes });
  } catch (err) {
    console.error('Error al cargar solicitudes pendientes:', err);
    res.render('admin/pendientes', { pendientes: [] });
  }
};

module.exports = { getPendientes };
