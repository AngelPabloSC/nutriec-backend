const express = require('express');
const router = express.Router();
const { foodRecordController } = require('../config/dependencies');

const requireBody = require('../middleware/requireBody');

/**
 * Create a new food record
 * POST /api/food-records
 */
router.post('/', requireBody, foodRecordController.create);

/**
 * Get food records for a user
 * POST /api/food-records/list
 * Body: { userId, startDate, endDate }
 */
router.post('/list', requireBody, foodRecordController.getAll);

module.exports = router;
