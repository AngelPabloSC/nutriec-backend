const express = require('express');
const router = express.Router();
const { foodRecordController } = require('../../config/dependencies');
const { protect } = require('../middleware/authMiddleware');
const requireBody = require('../middleware/requireBody');

/**
 * Get detailed statistics
 * GET /api/statistics/detailed?days=30
 */
router.get('/detailed', protect, foodRecordController.getDetailedStats);
router.post('/detailed', protect, requireBody, foodRecordController.getDetailedStats);

module.exports = router;
