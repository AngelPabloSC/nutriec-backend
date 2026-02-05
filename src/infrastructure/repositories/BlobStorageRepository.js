const blobStorage = require('../services/blobStorage');

class BlobStorageRepository {
    constructor() {
        this.blobStorageService = blobStorage;
    }

    /**
     * Upload file to blob storage
     */
    async uploadFile(blobName, fileBuffer, contentType) {
        try {
            return await this.blobStorageService.uploadFile(blobName, fileBuffer, contentType);
        } catch (error) {
            console.error('Repository error uploading file:', error);
            throw error;
        }
    }

    /**
     * List all blobs
     */
    async listFiles() {
        try {
            return await this.blobStorageService.listBlobs();
        } catch (error) {
            console.error('Repository error listing files:', error);
            throw error;
        }
    }

    /**
     * Delete a blob
     */
    async deleteFile(blobName) {
        try {
            return await this.blobStorageService.deleteBlob(blobName);
        } catch (error) {
            console.error('Repository error deleting file:', error);
            throw error;
        }
    }

    /**
     * Get file URL
     */
    getFileUrl(blobName) {
        return this.blobStorageService.getBlobUrl(blobName);
    }

    /**
     * Generate unique blob name for user image
     */
    generateBlobName(userId, fileName) {
        const timestamp = Date.now();
        const extension = fileName.split('.').pop();
        return `users/${userId}/food-images/${timestamp}.${extension}`;
    }
    /**
     * Upload base64 image
     */
    async uploadBase64(blobName, base64String) {
        try {
            // Remove header if present (e.g., "data:image/png;base64,")
            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            let buffer;
            let contentType = 'image/png';

            if (matches && matches.length === 3) {
                contentType = matches[1];
                buffer = Buffer.from(matches[2], 'base64');
            } else {
                buffer = Buffer.from(base64String, 'base64');
            }

            return await this.blobStorageService.uploadFile(blobName, buffer, contentType);
        } catch (error) {
            console.error('Repository error uploading base64:', error);
            throw error;
        }
    }
}

module.exports = BlobStorageRepository;
