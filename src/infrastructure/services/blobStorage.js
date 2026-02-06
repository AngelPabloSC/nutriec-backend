const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../../config/azure');

class BlobStorageService {
    constructor() {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(
            config.blobStorage.connectionString
        );
        this.containerName = config.blobStorage.containerName;
    }

    /**
     * Get container client
     */
    getContainerClient() {
        return this.blobServiceClient.getContainerClient(this.containerName);
    }

    /**
     * Upload a file to blob storage
     * @param {string} blobName - Name of the blob
     * @param {Buffer} fileBuffer - File buffer
     * @param {string} contentType - MIME type
     */
    async uploadFile(blobName, fileBuffer, contentType) {
        try {
            // Remove container name from blobName if present to avoid duplication in URL
            const sanitizedBlobName = blobName.startsWith(`${this.containerName}/`)
                ? blobName.replace(`${this.containerName}/`, '')
                : blobName;

            const containerClient = this.getContainerClient();
            const blockBlobClient = containerClient.getBlockBlobClient(sanitizedBlobName);

            const uploadResponse = await blockBlobClient.upload(
                fileBuffer,
                fileBuffer.length,
                {
                    blobHTTPHeaders: { blobContentType: contentType }
                }
            );

            return {
                success: true,
                url: blockBlobClient.url,
                etag: uploadResponse.etag
            };
        } catch (error) {
            console.error('Error uploading file to blob storage:', error);
            throw error;
        }
    }

    /**
     * List all blobs in container
     */
    async listBlobs() {
        try {
            const containerClient = this.getContainerClient();
            const blobs = [];

            for await (const blob of containerClient.listBlobsFlat()) {
                blobs.push({
                    name: blob.name,
                    size: blob.properties.contentLength,
                    lastModified: blob.properties.lastModified,
                    contentType: blob.properties.contentType
                });
            }

            return blobs;
        } catch (error) {
            console.error('Error listing blobs:', error);
            throw error;
        }
    }

    /**
     * Delete a blob
     * @param {string} blobName - Name of the blob to delete
     */
    async deleteBlob(blobName) {
        try {
            const containerClient = this.getContainerClient();
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.delete();
            return { success: true, message: `Blob ${blobName} deleted successfully` };
        } catch (error) {
            console.error('Error deleting blob:', error);
            throw error;
        }
    }

    /**
     * Get blob URL
     * @param {string} blobName - Name of the blob
     */
    getBlobUrl(blobName) {
        const containerClient = this.getContainerClient();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        return blockBlobClient.url;
    }

    /**
     * Test connection to blob storage
     */
    async testConnection() {
        try {
            const containerClient = this.getContainerClient();
            const exists = await containerClient.exists();

            if (exists) {
                const properties = await containerClient.getProperties();
                return {
                    success: true,
                    message: 'Connected to Blob Storage successfully',
                    containerName: this.containerName,
                    lastModified: properties.lastModified
                };
            } else {
                return {
                    success: false,
                    message: `Container '${this.containerName}' does not exist`
                };
            }
        } catch (error) {
            console.error('Error testing blob storage connection:', error);
            return {
                success: false,
                message: 'Failed to connect to Blob Storage',
                error: error.message
            };
        }
    }
}

module.exports = new BlobStorageService();
