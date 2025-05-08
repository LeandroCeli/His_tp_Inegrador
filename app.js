const express = require('express');
const pug = require('pug');
const PORT = 3000;
const app = express();
const session = require('express-session');
const fs = require('fs');



//CONFIGURANDO MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');


// Middleware para leer formularios
app.use(express.urlencoded({ extended: true }));

// Middleware de sesión
app.use(session({
    secret: 'claveSecreta123',
    resave: false,
    saveUninitialized: true
}));

// Middleware global para exponer el usuario en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Middleware para proteger rutas
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// PRINCIPAL
app.get('/', (req, res) => { res.render('index'); });

// LOGIN
app.get('/login', (req, res) => res.render('auth/login'));
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('auth/login', { error: 'Todos los campos son obligatorios.' });
    }

    const usuarios = JSON.parse(fs.readFileSync('./data/usuarios.json', 'utf-8'));
    const user = usuarios.find(u => u.email === email && u.password === password);

    if (user) {
        req.session.user = user;

        switch (user.rol) {
            case 'admin': return res.redirect('/admin/dashboard');
            case 'enfermeria': return res.redirect('/enfermeria/dashboard');
            case 'medico': return res.redirect('/medico/dashboard');
            case 'admision': return res.redirect('/admision/dashboard');
            default: return res.redirect('/');
        }
    } else {
        res.render('auth/login', { error: 'Credenciales incorrectas.' });
    }
});

app.get('/register', (req, res) => res.render('auth/register'));

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

//ADMIN
app.get('/admin/dashboard', requireLogin, (req, res) => { res.render('admin/dashboard'); });
app.get('/admin/usuarios', (req, res) => res.render('admin/usuarios'));
app.get('/admin/nuevoUsuario', (req, res) => res.render('admin/nuevoUsuario'));

// ADMISION
app.get('/admision/dashboard', requireLogin, (req, res) => { res.render('admision/dashboard'); });
app.get('/admision/nuevoPaciente', requireLogin, (req, res) => res.render('admision/nuevoPaciente'));
app.get('/admision/admision', requireLogin, (req, res) => res.render('admision/admision'));
app.get('/admision/internaciones', requireLogin, (req, res) => res.render('admision/internaciones'));
app.get('/admision/pacientes', requireLogin, (req, res) => res.render('admision/pacientes'));

//ENFERMERIA
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
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});