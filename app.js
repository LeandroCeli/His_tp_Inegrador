const express = require('express');
const pug = require('pug');
const PORT = 3000;
const app = express();



//cONFIGURANDO MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// PRINCIPAL
app.get('/', (req, res) => { res.render('index'); });


// LOGIN

//ADMIN
app.get('/admin/dashboard',(req, res) => { res.render('admin/dashboard');});
app.get('/admin/usuarios',(req, res) => res.render('admin/usuarios'));
app.get('/admin/nuevoUsuario', (req, res) => res.render('admin/nuevoUsuario'));


// ADMISION



// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});