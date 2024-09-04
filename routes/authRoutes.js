
const { registerUser,loginUser } = require('../controllers/authController');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRegistration = require('../models/UserRegistration');
const { env } = require('process');

// Register User


module.exports = router;

router.post('/register', registerUser)

// Login User
router.post('/login', loginUser)



module.exports = router;


///


