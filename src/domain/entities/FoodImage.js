class FoodImage {
    constructor({ id, userId, imageUrl, blobName, predictions, uploadedAt }) {
        this.id = id;
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.blobName = blobName;
        this.predictions = predictions || [];
        this.uploadedAt = uploadedAt || new Date().toISOString();
    }

    validate() {
        if (!this.userId) {
            throw new Error('User ID is required');
        }
        if (!this.imageUrl) {
            throw new Error('Image URL is required');
        }
        if (!this.blobName) {
            throw new Error('Blob name is required');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            imageUrl: this.imageUrl,
            blobName: this.blobName,
            predictions: this.predictions,
            uploadedAt: this.uploadedAt
        };
    }
}

module.exports = FoodImage;
