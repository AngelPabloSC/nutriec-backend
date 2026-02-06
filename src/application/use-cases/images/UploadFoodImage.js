const FoodImage = require('../../../domain/entities/FoodImage');

class UploadFoodImage {
    constructor(blobStorageRepository, cosmosDbRepository) {
        this.blobStorageRepo = blobStorageRepository;
        this.cosmosDbRepo = cosmosDbRepository;
    }

    async execute(userId, file) {
        try {
            // Validate file
            if (!file || !file.buffer) {
                throw new Error('No file provided');
            }

            // Generate unique blob name
            const blobName = this.blobStorageRepo.generateBlobName(userId, file.originalname);

            // Upload to blob storage
            const uploadResult = await this.blobStorageRepo.uploadFile(
                blobName,
                file.buffer,
                file.mimetype
            );

            if (!uploadResult.success) {
                throw new Error('Failed to upload image');
            }

            // Create domain entity
            const foodImage = new FoodImage({
                id: Date.now().toString(),
                userId: userId,
                imageUrl: uploadResult.url,
                blobName: blobName,
                uploadedAt: new Date().toISOString()
            });

            // Validate
            foodImage.validate();

            // Save metadata to database
            await this.cosmosDbRepo.create(foodImage.toJSON());

            return {
                success: true,
                data: {
                    imageUrl: uploadResult.url,
                    blobName: blobName,
                    id: foodImage.id
                }
            };
        } catch (error) {
            console.error('Error in UploadFoodImage use case:', error);
            throw error;
        }
    }
}

module.exports = UploadFoodImage;
