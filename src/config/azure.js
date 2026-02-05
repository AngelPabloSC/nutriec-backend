module.exports = {
    // Azure Blob Storage
    blobStorage: {
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.BLOB_CONTAINER || 'images'
    },

    // Cosmos DB
    cosmosDb: {
        connectionString: process.env.COSMOS_CONNECTION_STRING,
        databaseId: process.env.COSMOS_DB || 'nutriecdb',
        containerId: process.env.COSMOS_CONTAINER || 'registros'
    },

    // Custom Vision
    customVision: {
        endpoint: process.env.CV_ENDPOINT,
        trainingKey: process.env.CV_TRAINING_KEY,
        predictionKey: process.env.CV_PREDICTION_KEY,
        projectId: process.env.CV_PROJECT_ID,
        publishedName: process.env.CV_PUBLISHED_NAME
    }
};
