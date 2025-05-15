const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');

const sequelize = require('./config/sequelize'); // Conexión Sequelize
const fs = require('fs');

const app = express();
const PORT = 3000;

// ================== CONFIGURACIONES ==================

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/js', express.static('public/js'));

app.use(session({
    secret: 'claveSecreta123',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}


// ================== RUTAS ==================

// Inicio
app.get('/', (req, res) => res.render('index'));

// Login
app.get('/login', (req, res) => res.render('auth/login'));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('auth/login', { error: 'Todos los campos son obligatorios.' });
  }

  const usuarios = JSON.parse(fs.readFileSync('./data/usuarios.json', 'utf-8'));
  const user = usuarios.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.render('auth/login', { error: 'Credenciales incorrectas.' });
  }

  req.session.user = {
    id: user.id,
    nombre: user.nombre,
    rol: user.rol
  };

  switch (user.rol) {
    case 'admin': return res.redirect('/admin/dashboard');
    case 'enfermeria': return res.redirect('/enfermeria/dashboard');
    case 'medico': return res.redirect('/medico/dashboard');
    case 'admision': return res.redirect('/admision/dashboard');
    default: return res.redirect('/');
  }
});

app.get('/register', (req, res) => res.render('auth/register'));



const { SolicitudRegistro, Usuario } = require('./models'); // Asegurate que estén bien importados

app.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, rolDeseado } = req.body;

  try {
    // 1. Verifica si el correo ya está registrado como usuario activo
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.render('auth/register', { error: 'Este correo ya está registrado como usuario.' });
    }

    // 2. Verifica si ya hay una solicitud con ese email
    const solicitudExistente = await SolicitudRegistro.findOne({ where: { email } });
    if (solicitudExistente) {
      return res.render('auth/register', { error: 'Ya existe una solicitud pendiente con este correo.' });
    }

    // 3. Si todo está bien, guardar la solicitud
    const hashedPassword = await bcrypt.hash(password, 10);

    await SolicitudRegistro.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rolDeseado
    });

    res.render('auth/register', { success: 'Solicitud enviada correctamente. Un administrador la revisará.' });

  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Error al procesar la solicitud. Intente más tarde.' });
  }
});








app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ADMIN
//app.get('/admin/dashboard', requireLogin, (req, res) => res.render('admin/dashboard'));

//const { SolicitudRegistro, Usuario } = require('./models');

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

app.get('/admin/nuevoUsuario', requireLogin, (req, res) => res.render('admin/nuevoUsuario'));
// POST: Procesar nuevo usuario
app.post('/admin/nuevoUsuario', requireLogin, async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  const errores = {};

  // Validaciones
  if (!nombre) errores.nombre = 'El nombre es obligatorio.';
  if (!apellido) errores.apellido = 'El apellido es obligatorio.';
  if (!email) errores.email = 'El correo es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = 'Formato de correo inválido.';
  if (!password) errores.password = 'La contraseña es obligatoria.';
  else if (password.length < 6) errores.password = 'Debe tener al menos 6 caracteres.';
  if (!rol) errores.rol = 'El rol es obligatorio.';

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) errores.email = 'Este correo ya está registrado.';
  } catch (error) {
    console.error(error);
  }

  if (Object.keys(errores).length > 0) {
    return res.render('admin/nuevoUsuario', {
      errores,
      nombre,
      apellido,
      email,
      rol
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol,
      activo: true
    });

    res.render('admin/nuevoUsuario', {
      success: 'Usuario creado exitosamente.',
      preguntarNuevo: true
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.render('admin/nuevoUsuario', { errorGeneral: 'Error inesperado al crear el usuario.' });
  }
});

//=> res.render('admin/areaInternaciones'));

app.get('/admin/areaInternaciones', requireLogin, async (req, res) => {
  try {
    // Consulta a la base de datos para obtener todos los usuarios
    const habitaciones = await Habitacion.findAll({ 
      attributes: ['numero', 'tipo', 'estado'] 
    });

    // Renderiza la vista y envía los datos de usuarios
    res.render('admin/areaInternaciones', { habitaciones });
  } catch (err) {
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

  try {
    await Habitacion.create({ numero, tipo, estado });
    res.render('admin/nuevaHabitacion', {
      success: 'Habitación creada exitosamente.',
      preguntarOtra: true
    });
  } catch (err) {
    console.error(err);
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

// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
