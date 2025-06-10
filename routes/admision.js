const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');
const admisionControllers = require('../controllers/admisionControllers');
const admisionController = require('../controllers/admisionControllers');

router.get('/dashboard', requireLogin,admisionControllers.getPrincipal);
router.get('/paciente/buscar', requireLogin, admisionControllers.getPacientePorDNI);
router.get('/paciente/:id', requireLogin, (req, res) => {res.render('admision/paciente')});
router.get('/pacienteRegistrado',requireLogin,admisionControllers.getDatosIniciales);
router.get('/pacienteNuevo', requireLogin, admisionControllers.getFormularioNuevoPaciente);
router.post('/pacienteCarga', requireLogin, admisionControllers.cargarPaciente);
router.get('/habitacionesDisponibles/:id_area',requireLogin, admisionControllers.HDisponibles);
router.get('/paciente', requireLogin,admisionControllers.getVistaPaciente );
router.post('/internarPaciente', requireLogin, admisionControllers.registrarInternacion );
router.get('/emergencia',requireLogin,(req, res) => {res.render('admision/emergencia'); }); 
router.post('/emergencia',requireLogin,admisionController.guardarEmergencia);
router.get('/datos/:id',requireLogin,admisionControllers.getDatosPaciente);
router.post('/paciente/:id/editar',requireLogin,admisionControllers.actualizarPaciente);
router.post('/paciente/:id/eliminar',requireLogin,admisionControllers.eliminarPaciente);
router.get('/mutual/:id',requireLogin,admisionControllers.mostrarMutual);
router.get('/listaPacientes',requireLogin,admisionControllers.ListarPacientes);

module.exports = router;