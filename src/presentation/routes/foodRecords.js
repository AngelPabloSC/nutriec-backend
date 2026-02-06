const express = require('express');
const multer = require('multer');
const router = express.Router();
const { foodRecordController } = require('../../config/dependencies');

const { protect } = require('../middleware/authMiddleware');
const requireBody = require('../middleware/requireBody');

/**
 * Get Daily Summary
 * POST /meals/summary (via alias) or /api/food-records/summary
 * Body: { date: 'YYYY-MM-DD' }
 */
router.post('/summary', protect, requireBody, foodRecordController.getDailySummary);

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * Get food history (Grouped by Day)
 * GET /api/meals/history?startDate=X&endDate=Y
 * POST /api/meals/history (Body: { startDate, endDate })
 */
router.get('/history', protect, foodRecordController.getHistory);
router.post('/history', protect, requireBody, foodRecordController.getHistory);

/**
 * Create a new food record (Hybrid: JSON or Multipart)
 * POST /api/food-records
 * Header: Authorization
 * Body: { foodName, calories, ... } + optional file 'image'
 */
router.post('/', protect, upload.single('image'), requireBody, foodRecordController.create);

/**
 * Get food records for a user
 * GET /api/meals?date=YYYY-MM-DD
 * POST /api/food-records/list (Legacy)
 */
router.get('/', protect, foodRecordController.getAll);
/**
 * Get food records for a user
 * POST /api/meals/list
 * Body: { date: 'YYYY-MM-DD' } (Optional: startDate, endDate)
 */
router.post('/list', protect, requireBody, foodRecordController.getAll);

module.exports = router;
