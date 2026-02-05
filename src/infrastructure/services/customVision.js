const { TrainingAPIClient } = require('@azure/cognitiveservices-customvision-training');
const { PredictionAPIClient } = require('@azure/cognitiveservices-customvision-prediction');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
const config = require('../../config/azure');

class CustomVisionService {
    constructor() {
        // Training client
        const trainingCredentials = new ApiKeyCredentials({
            inHeader: { 'Training-key': config.customVision.trainingKey }
        });
        this.trainingClient = new TrainingAPIClient(
            trainingCredentials,
            config.customVision.endpoint
        );

        // Prediction client
        const predictionCredentials = new ApiKeyCredentials({
            inHeader: { 'Prediction-key': config.customVision.predictionKey }
        });
        this.predictionClient = new PredictionAPIClient(
            predictionCredentials,
            config.customVision.endpoint
        );

        this.projectId = config.customVision.projectId;
        this.publishedName = config.customVision.publishedName;
    }

    /**
     * List all training projects
     */
    async listProjects() {
        try {
            const projects = await this.trainingClient.getProjects();
            return {
                success: true,
                data: projects.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    created: p.created,
                    lastModified: p.lastModified
                }))
            };
        } catch (error) {
            console.error('Error listing Custom Vision projects:', error);
            throw error;
        }
    }

    /**
     * Predict image using published model
     * @param {Buffer} imageBuffer - Image buffer
     */
    async predictImage(imageBuffer) {
        try {
            if (!this.projectId || !this.publishedName) {
                throw new Error('Project ID and Published Name must be configured in .env');
            }

            const results = await this.predictionClient.classifyImage(
                this.projectId,
                this.publishedName,
                imageBuffer
            );

            return {
                success: true,
                predictions: results.predictions.map(p => ({
                    tagName: p.tagName,
                    probability: (p.probability * 100).toFixed(2) + '%'
                }))
            };
        } catch (error) {
            console.error('Error predicting image:', error);
            throw error;
        }
    }

    /**
     * Test connection to Custom Vision
     */
    async testConnection() {
        try {
            const projects = await this.trainingClient.getProjects();

            return {
                success: true,
                message: 'Connected to Custom Vision successfully',
                projectCount: projects.length,
                projects: projects.map(p => ({
                    id: p.id,
                    name: p.name
                })),
                hasProjectId: !!this.projectId,
                hasPublishedName: !!this.publishedName
            };
        } catch (error) {
            console.error('Error testing Custom Vision connection:', error);
            return {
                success: false,
                message: 'Failed to connect to Custom Vision',
                error: error.message
            };
        }
    }
}

module.exports = new CustomVisionService();
