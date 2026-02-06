const express = require('express');
const router = express.Router();
const { userController } = require('../../config/dependencies');
const { protect } = require('../middleware/authMiddleware');

const requireBody = require('../middleware/requireBody');

/**
 * Get User Profile
 * POST /api/user/profile (Auth Required)
 * Although GET is semantic, client requested all POSTs.
 */
router.post('/profile', protect, requireBody, userController.getProfile);

const upload = require('../middleware/uploadMiddleware');

/**
 * Update User Profile
 * POST /api/user/update (Auth Required)
 * Consumes: multipart/form-data or application/json
 */
router.post('/update', protect, upload.single('image'), requireBody, userController.updateProfile);

module.exports = router;
