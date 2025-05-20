const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminControllers');
const usuarioController = require('../controllers/usuarioController');
const habitacioControllers = require('../controllers/internacionesController');
const solicitudControllers = require('../controllers/solicitudController');



router.get('/dashboard',requireLogin,adminController.getDashboard);
router.get('/usuarios',requireLogin,usuarioController.getUsuarios);
router.get('/areaInternaciones',requireLogin,habitacioControllers.getAreaInternaciones);
router.get('/pendientes',requireLogin,solicitudControllers.getPendientes);


module.exports = router;