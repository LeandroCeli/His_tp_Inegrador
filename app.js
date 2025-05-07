const express = require('express');
const pug = require('pug');
const PORT = 3000;
const app = express();



//CONFIGURANDO MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// PRINCIPAL
app.get('/', (req, res) => { res.render('index'); });

// LOGIN
app.get('/login', (req, res) => res.render('auth/login'));
app.get('/register', (req, res) => res.render('auth/register'));

//ADMIN
app.get('/admin/dashboard',(req, res) => { res.render('admin/dashboard');});
app.get('/admin/usuarios',(req, res) => res.render('admin/usuarios'));
app.get('/admin/nuevoUsuario', (req, res) => res.render('admin/nuevoUsuario'));

// ADMISION
app.get('/admision/dashboard',(req, res) => { res.render('admision/dashboard');});
app.get('/admision/nuevoPaciente',(req, res) => res.render('admision/nuevoPaciente'));
app.get('/admision/admision', (req, res) => res.render('admision/admision'));
app.get('/admision/internaciones', (req, res) => res.render('admision/internaciones'));
app.get('/admision/pacientes', (req, res) => res.render('admision/pacientes'));

//ENFERMERIA
app.get('/enfermeria/dashboard', (req, res) => res.render('enfermeria/dashboard'));
app.get('/enfermeria/evaluar',(req, res) => res.render('enfermeria/evaluar'));
app.get('/enfermeria/evaluaciones',(req, res) => res.render('enfermeria/evaluaciones'));

// MEDICO
app.get('/medico/dashboard', (req, res) => res.render('medico/dashboard'));
app.get('/medico/evaluar',(req, res) => res.render('medico/evaluar'));
app.get('/medico/evaluaciones', (req, res) => res.render('medico/evaluaciones'));
app.get('/medico/alta',  (req, res) => res.render('medico/alta'));


// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});