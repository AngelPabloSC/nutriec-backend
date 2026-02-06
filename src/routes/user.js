const express = require('express');
const router = express.Router();
const { userController } = require('../config/dependencies');
const { protect } = require('../middleware/authMiddleware');

const requireBody = require('../middleware/requireBody');

/**
 * Get User Profile
 * POST /api/user/profile (Auth Required)
 * Although GET is semantic, client requested all POSTs.
 */
router.post('/profile', protect, requireBody, userController.getProfile);

/**
 * Update User Profile
 * POST /api/user/update (Auth Required)
 */
router.post('/update', protect, requireBody, userController.updateProfile);

module.exports = router;
