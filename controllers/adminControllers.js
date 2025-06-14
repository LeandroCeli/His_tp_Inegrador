
const { Usuario, SolicitudRegistro, Habitacion } = require('../models');
const getDashboard = async (req, res) => {
  try {
   
    const totalUsuarios = await Usuario.count();
   // const pendientes = await SolicitudRegistro.count({ where: { estado: 'pendiente' } });
    const habitaciones = await Habitacion.count(); // vemo el tema de  
    // Renderizar la vista del dashboard
    res.render('admin/dashboard', {
      totalUsuarios,
      //cantidadPendientes: pendientes,
      habitaciones,
    
       // Por el momento
      cantidadPendientes: 0,
      //habitaciones: 0
    });
  } catch (err) {
    console.error('Error cargando dashboard:', err);
    res.render('admin/dashboard', {
      totalUsuarios: 0,
      cantidadPendientes: 0,
      habitaciones: 0
    });
  }
};

const getAreaInternaciones = async (req,res) => 
{
  try {
    // Consulta a la base de datos para obtener todos los usuarios
    
    const habitaciones = await Habitacion.findAll({ 
      attributes: ['numero_habitacion','tipo','id_area ', 'estado_habitacion'] 
    });
     
    // Renderiza la vista y envía los datos de usuarios
    res.render('admin/areaInternaciones', { habitaciones });
  } catch (err) 
  {
    console.error('Error al cargar Habitaciones:', err);
    res.render('admin/areaInternaciones', { habitaciones: [] });
  }
}
module.exports = {
  getDashboard,
  getAreaInternaciones
};
