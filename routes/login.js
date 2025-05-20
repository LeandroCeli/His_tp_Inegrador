const express = require('express');
const router = express.Router();

const loginControllers = require('../controllers/loginControllers');

router.get('/', (req, res) => res.render('auth/login'));

router.post('/ingreso',loginControllers.ingreso);

router.get('/logout',loginControllers.logout);


module.exports = router;