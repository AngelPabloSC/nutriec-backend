const express = require('express');
const router = express.Router();
const blobStorage = require('../infrastructure/services/blobStorage');
const cosmosDb = require('../infrastructure/services/cosmosDb');
const customVision = require('../infrastructure/services/customVision');

/**
 * Test Blob Storage connection
 * POST /api/test/blob
 */
router.post('/blob', async (req, res) => {
    try {
        const containers = await blobStorage.listBlobs();
        res.json({ success: true, containers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Test Cosmos DB connection
 * POST /api/test/cosmos
 */
router.post('/cosmos', async (req, res) => {
    try {
        const { database, container } = await cosmosDb.init();
        res.json({ success: true, database: database.id, container: container.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Test Custom Vision connection
 * POST /api/test/vision
 */
router.post('/vision', async (req, res) => {
    try {
        const result = await customVision.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Test all connections
 * POST /api/test/all
 */
// Get Container Info (DEBUG PK)
// Get Container Info (DEBUG PK)
router.post('/info', async (req, res) => {
    try {
        const { resource } = await cosmosDb.container.read();
        res.json(resource);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/all', async (req, res) => {
    const results = {
        blobStorage: { success: false },
        cosmosDb: { success: false },
        customVision: { success: false }
    };

    try {
        await blobStorage.listBlobs();
        results.blobStorage.success = true;
    } catch (e) {
        results.blobStorage.error = e.message;
    }

    try {
        const { database, container } = await cosmosDb.init();
        if (database && container) results.cosmosDb.success = true;
    } catch (e) {
        results.cosmosDb.error = e.message;
    }

    try {
        const visionResult = await customVision.testConnection();
        results.customVision = visionResult;
    } catch (e) {
        results.customVision.error = e.message;
    }

    res.json(results);
});

module.exports = router;
