const express = require('express');
const router = express.Router();
const { userController } = require('../config/dependencies');
const { protect } = require('../middleware/authMiddleware');

/**
 * Get User Profile
 * POST /api/user/profile (Auth Required)
 * Although GET is semantic, client requested all POSTs.
 */
router.post('/profile', protect, userController.getProfile);

/**
 * Update User Profile
 * POST /api/user/update (Auth Required)
 */
router.post('/update', protect, userController.updateProfile);

module.exports = router;
