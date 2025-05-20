// controllers/admin/internacionesController.js
const { Habitacion } = require('../models');

const formularioNuevaHabitacion = (req, res) => {
  const success = req.query.success === '1';
  res.render('admin/nuevaHabitacion', {
    success,
    preguntarOtraHabitacion: success
  });
};



const getAreaInternaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.findAll({
      attributes: ['numero', 'tipo', 'estado']
    });
    res.render('admin/areaInternaciones', { habitaciones });
  } catch (err) {
    console.error('Error al cargar habitaciones:', err);
    res.render('admin/areaInternaciones', { habitaciones: [] });
  }
};

const crearHabitacion = async (req, res) => 
  {
    const { numero, tipo, estado } = req.body;
    const errores = {};
  
    if (!numero) errores.numero = 'El número de habitación es obligatorio.';
    if (!tipo) errores.tipo = 'Debe seleccionar un tipo.';
    if (!estado) errores.estado = 'Debe seleccionar un estado.';
  
    // Verificar duplicado
    const existe = await Habitacion.findOne({ where: { numero } });
    if (existe) errores.numero = 'Este número ya está registrado.';
  
    if (Object.keys(errores).length > 0) {
      return res.render('admin/nuevaHabitacion', {
        errores,
        numero,
        tipo,
        estado
      });
    }
  
    try 
    {console.log('Datos recibidos:', { numero, tipo, estado });
     await Habitacion.create({ numero: String(numero), tipo, estado });
     
      res.render('admin/nuevaHabitacion', {
        success: 'Habitación creada exitosamente.',
        preguntarOtraHabitacion: true
      });
    } catch (err) {
      console.error('aca' + err);
      res.render('admin/nuevaHabitacion', {
        errorGeneral: 'Error inesperado al guardar la habitación.'
      });
    }
  }

module.exports = { 
  getAreaInternaciones,
  formularioNuevaHabitacion,
  crearHabitacion
  };
