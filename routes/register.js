const express = require('express');
const router = express.Router();

const register = require('../controllers/registerControllers')

router.get('/', (req, res) => res.render('auth/register'));
router.post('/register',register.solicitud);

module.exports = router;