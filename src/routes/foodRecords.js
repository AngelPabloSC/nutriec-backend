const express = require('express');
const router = express.Router();
const { foodRecordController } = require('../config/dependencies');

/**
 * Create a new food record
 * POST /api/food-records
 */
router.post('/', foodRecordController.create);

/**
 * Get food records for a user
 * POST /api/food-records/list
 * Body: { userId, startDate, endDate }
 */
router.post('/list', foodRecordController.getAll);

module.exports = router;
