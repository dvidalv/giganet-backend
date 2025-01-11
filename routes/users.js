const { Router } = require('express');
const { login, register } = require('../controllers/authController');


const router = Router();

//Ruter de autenticacion
router.post('/login', login);
router.post('/signup', register);

module.exports = router;
