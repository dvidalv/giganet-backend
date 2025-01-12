const { Router } = require('express');
const { login, register } = require('../controllers/authController');


const router = Router();

//Ruter de autenticacion
router.post('/login', login);
router.post('/register', register);

module.exports = router;
