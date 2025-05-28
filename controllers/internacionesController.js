// controllers/admin/internacionesController.js
const { Habitacion, Area } = require('../models');

const formularioNuevaHabitacion = async (req, res) => {
  const success = req.query.success === '1';
  const areas = await Area.findAll();

  res.render('admin/nuevaHabitacion', {
    success,
    preguntarOtraHabitacion: success,
    areas,
    errores: {},
    id_area: '',
    numero: '',
    tipo: '',
    estado: 'disponible', // valor por defecto
    errorGeneral: null
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

const crearNuevaHabitacion = async (req, res) => {
  const { id_area, numero, tipo } = req.body;
  const areas = await Area.findAll();
  const errores = {};

  // Validación simple
  if (!id_area) errores.area = 'Debe seleccionar un área.';
  if (!numero) errores.numero = 'Debe ingresar un número de habitación.';
  if (!tipo) errores.tipo = 'Debe seleccionar un tipo.';

  // Validar existencia: buscar si ya existe esa habitación en esa área
  const existente = await Habitacion.findOne({
    where: {
      id_area,
      numero_habitacion: numero
    }
  });

  if (existente) {
    errores.numero = 'Ya existe una habitación con ese número en el área seleccionada.';
  }

  if (Object.keys(errores).length > 0) {
    return res.render('admin/nuevaHabitacion', {
      areas,
      errores,
      numero,
      id_area,
      tipo,
      errorGeneral: 'Por favor revise los campos.'
    });
  }

  // Crear habitación: ojo, usá "numero_habitacion" para que Sequelize mapee bien
  await Habitacion.create({
    id_area,
    numero_habitacion: numero,
    tipo,
    estado_habitacion: 'disponible' // poner estado por defecto
  });

  return res.redirect('/areaInternaciones/nuevaHabitacion?success=1');
};


module.exports = { 
  getAreaInternaciones,
  formularioNuevaHabitacion,
  crearNuevaHabitacion
  };
