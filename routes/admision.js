const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');
const admisionControllers = require('../controllers/admisionControllers');


router.get('/dashboard', requireLogin, (req, res) => {res.render('admision/dashboard'); });
router.get('/paciente/buscar', requireLogin, admisionControllers.getPacientePorDNI);
router.get('/paciente/:id', requireLogin, (req, res) => {res.render('admision/paciente'); });
router.get('/pacienteRegistrado',requireLogin,admisionControllers.getDatosIniciales);
router.get('/pacienteNuevo', requireLogin, admisionControllers.getFormularioNuevoPaciente);
router.post('/pacienteCarga', requireLogin, admisionControllers.cargarPaciente);


router.get('/habitacionesDisponibles/:id_area',requireLogin, admisionControllers.HDisponibles);



router.get('/paciente', requireLogin, (req, res) => {
    const info = req.session.informacionPaciente || null;
    res.render('admision/paciente', 
      {
      informacionPaciente: info,
      tiposIngreso:info.tiposIngreso,
      areas:info.areas
      });
  });

module.exports = router;