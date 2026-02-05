const express = require('express');
const multer = require('multer');
const router = express.Router();
const { imageController } = require('../config/dependencies');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

/**
 * Upload a food image
 * POST /api/images/upload
 * Body: { userId: string, file: File }
 */
router.post('/upload', upload.single('image'), imageController.upload);

/**
 * Analyze a food image with AI
 * POST /api/images/analyze
 * Body: { file: File }
 */
router.post('/analyze', upload.single('image'), imageController.analyze);

module.exports = router;
