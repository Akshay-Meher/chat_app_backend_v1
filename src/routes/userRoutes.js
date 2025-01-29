const express = require('express');
const { register, login, getAllUsers } = require('../controllers/userController');
const { body } = require('express-validator');
const { loginValidation } = require('../utils/validations');

const router = express.Router();


router.get('/getAll', getAllUsers);

router.post('/register', loginValidation, register);

router.post('/login', login);

module.exports = router;
