const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');

const InternacionesController = require('../controllers/internacionesController'); 

router.get('/formularioNuevaHabitacion',requireLogin,InternacionesController.formularioNuevaHabitacion);
router.post('/nuevaHabitacion',requireLogin,InternacionesController.crearNuevaHabitacion);



module.exports = router;