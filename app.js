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



// ADMISION
app.get('/admision/dashboard', requireLogin, (req, res) => res.render('admision/dashboard'));
app.get('/admision/nuevoPaciente', requireLogin, (req, res) => res.render('admision/nuevoPaciente'));
app.get('/admision/paciente', requireLogin, (req, res) => res.render('admision/paciente'));
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

