const customVision = require('../../infrastructure/services/customVision');

class AnalyzeFood {
    constructor() {
        this.customVisionService = customVision;
    }

    async execute(imageBuffer) {
        try {
            // Validate input
            if (!imageBuffer) {
                throw new Error('No image buffer provided');
            }

            // Analyze with Custom Vision
            const result = await this.customVisionService.predictImage(imageBuffer);

            return {
                success: true,
                predictions: result.predictions
            };
        } catch (error) {
            console.error('Error in AnalyzeFood use case:', error);

            // If Custom Vision is not configured, return graceful message
            if (error.message.includes('Project ID')) {
                return {
                    success: false,
                    message: 'Custom Vision model not configured yet',
                    predictions: []
                };
            }

            throw error;
        }
    }
}

module.exports = AnalyzeFood;
