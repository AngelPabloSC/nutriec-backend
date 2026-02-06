const express = require('express');
const router = express.Router();
const { authController } = require('../../config/dependencies');

/**
 * Register a new user
 * POST /auth/register
 */
// Pass next implicitly by passing the function reference
const upload = require('../middleware/uploadMiddleware');

/**
 * Register a new user
 * POST /auth/register
 * Consumes: multipart/form-data
 */
router.post('/register', upload.single('image'), authController.register);

const requireBody = require('../middleware/requireBody');

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', requireBody, authController.login);


module.exports = router;
