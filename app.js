// ================== IMPORTACIONES ==================
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/sequelize'); // Conexión a la BD

// Importación de rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const usuarioRoutes = require('./routes/usuario');
const internacionController =  require('./routes/internaciones');

// Middleware de autenticación
const requireLogin = require('./middlewares/authMiddleware');

// ================== INICIALIZACIÓN ==================
const app = express();
const PORT = 3000;

// ================== CONFIGURACIONES ==================
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejo de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Sesión
app.use(session({
    secret: 'claveSecreta123',
    resave: false,
    saveUninitialized: true
}));

// Middleware para hacer disponible el usuario en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ================== RUTAS ==================
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/login', authRoutes);
app.use('/register', registerRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/usuarios',adminRoutes);
app.use('/usuarios',usuarioRoutes);
app.use('/areaInternaciones',internacionController);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


/*
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});
*/ 

// ADMIN
//app.get('/admin/dashboard', requireLogin, (req, res) => res.render('admin/dashboard'));

//const { SolicitudRegistro, Usuario } = require('./models');

/*
app.get('/admin/dashboard', requireLogin, async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count();
    const pendientes = await SolicitudRegistro.count({ where: { estado: 'pendiente' } });
    const habitaciones = await Habitacion.count();

    res.render('admin/dashboard', {
      totalUsuarios,
      cantidadPendientes: pendientes,habitaciones
    });
  } catch (err) {
    console.error('Error cargando dashboard:', err);
    res.render('admin/dashboard', {
      totalUsuarios: 0,
      cantidadPendientes: 0
    });
  }
});


//app.get('/admin/usuarios', requireLogin, (req, res) => res.render('admin/usuarios'));
app.get('/admin/usuarios', requireLogin, async (req, res) => {
  try {
    // Consulta a la base de datos para obtener todos los usuarios
    const usuarios = await Usuario.findAll({ 
      attributes: ['nombre', 'apellido', 'email', 'rol', 'activo'] 
    });

    // Renderiza la vista y envía los datos de usuarios
    res.render('admin/usuarios', { usuarios });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    res.render('admin/usuarios', { usuarios: [] });
  }
});



app.get('/admin/areaInternaciones', requireLogin, async (req, res) => {
  try {
    // Consulta a la base de datos para obtener todos los usuarios
    const habitaciones = await Habitacion.findAll({ 
      attributes: ['numero', 'tipo', 'estado'] 
    });
     
    // Renderiza la vista y envía los datos de usuarios
    res.render('admin/areaInternaciones', { habitaciones });
  } catch (err) 
  {
    console.error('Error al cargar Habitaciones:', err);
    res.render('admin/areaInternaciones', { habitaciones: [] });
  }
});


app.get('/admin/nuevaHabitacion', requireLogin, (req, res) => res.render('admin/nuevaHabitacion'));
const Habitacion = require('./models/Habitacion');
// cargar habitacion 
app.post('/admin/habitaciones', requireLogin, async (req, res) => {
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
      preguntarOtra: true
    });
  } catch (err) {
    console.error('aca' + err);
    res.render('admin/nuevaHabitacion', {
      errorGeneral: 'Error inesperado al guardar la habitación.'
    });
  }
});

app.get('/admin/pendientes', requireLogin, async (req, res) => {
  try {
    const pendientes = await SolicitudRegistro.findAll();

    
    
    
    res.render('admin/pendientes', { pendientes });
  } catch (err) {
    console.error('Error al cargar solicitudes pendientes:', err);
    res.render('admin/pendientes', { pendientes: [] });
  }
});


*/


// ADMISION
app.get('/admision/dashboard', requireLogin, (req, res) => res.render('admision/dashboard'));
app.get('/admision/nuevoPaciente', requireLogin, (req, res) => res.render('admision/nuevoPaciente'));
app.get('/admision/admision', requireLogin, (req, res) => res.render('admision/admision'));
app.get('/admision/internaciones', requireLogin, (req, res) => res.render('admision/internaciones'));
app.get('/admision/pacientes', requireLogin, (req, res) => res.render('admision/pacientes'));

// ENFERMERIA
app.get('/enfermeria/dashboard', requireLogin, (req, res) => res.render('enfermeria/dashboard'));
app.get('/enfermeria/evaluar', requireLogin, (req, res) => res.render('enfermeria/evaluar'));
app.get('/enfermeria/evaluaciones', requireLogin, (req, res) => res.render('enfermeria/evaluaciones'));

// MEDICO
app.get('/medico/dashboard', requireLogin, (req, res) => res.render('medico/dashboard'));
app.get('/medico/evaluar', requireLogin, (req, res) => res.render('medico/evaluar'));
app.get('/medico/evaluaciones', requireLogin, (req, res) => res.render('medico/evaluaciones'));
app.get('/medico/alta', requireLogin, (req, res) => res.render('medico/alta'));

