const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');

const usuarioController = require('../controllers/usuarioController'); 

router.get('/nuevoUsuario',requireLogin,usuarioController.mostrarFormularioNuevoUsuario);
router.post('/nuevoUsuario',requireLogin,usuarioController.crearUsuario)
module.exports = router;