const express = require('express');
const router = express.Router();
const { authController } = require('../config/dependencies');

/**
 * Register a new user
 * POST /auth/register
 */
// Pass next implicitly by passing the function reference
router.post('/register', authController.register);

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', authController.login);


module.exports = router;
