const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');
const admisionControllers = require('../controllers/admisionControllers');


router.get('/dashboard', requireLogin, (req, res) => {res.render('admision/dashboard'); });
router.get('/paciente/buscar', requireLogin, admisionControllers.getPacientePorDNI);
//router.get('/pacienteNuevo', requireLogin, (req, res) => {res.render('admision/nuevoPaciente'); });
router.get('/paciente/:id', requireLogin, (req, res) => {res.render('admision/paciente'); });

router.get('/pacienteNuevo', requireLogin, admisionControllers.getFormularioNuevoPaciente);

router.post('/pacienteCarga', requireLogin, admisionControllers.cargarPaciente);

//router.get('/paciente/nuevoPaciente', requireLogin, (req, res) => {res.render('admision/nuevoPaciente'); });

module.exports = router;