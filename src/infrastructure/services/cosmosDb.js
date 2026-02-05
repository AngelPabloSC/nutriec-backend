const { CosmosClient } = require('@azure/cosmos');
const config = require('../../config/azure');

class CosmosDbService {
    constructor() {
        this.client = new CosmosClient(config.cosmosDb.connectionString);
        this.databaseId = config.cosmosDb.databaseId;
        this.containerId = config.cosmosDb.containerId;
        this.database = null;
        this.container = null;
    }

    /**
     * Initialize database and container
     */
    async init() {
        if (!this.database) {
            this.database = this.client.database(this.databaseId);
            this.container = this.database.container(this.containerId);
        }
        return this.container;
    }

    /**
     * Create a new document
     * @param {object} item - Document to create
     */
    async createItem(item) {
        try {
            await this.init();
            const { resource } = await this.container.items.create(item);
            return {
                success: true,
                data: resource
            };
        } catch (error) {
            console.error('Error creating item in Cosmos DB:', error);
            throw error;
        }
    }

    /**
     * Read a document by ID
     * @param {string} id - Document ID
     * @param {string} partitionKey - Partition key value
     */
    async readItem(id, partitionKey) {
        try {
            await this.init();
            const { resource } = await this.container.item(id, partitionKey).read();
            return {
                success: true,
                data: resource
            };
        } catch (error) {
            console.error('Error reading item from Cosmos DB:', error);
            throw error;
        }
    }

    /**
     * Query documents
     * @param {string} querySpec - SQL query or query object
     */
    async queryItems(querySpec) {
        try {
            await this.init();
            const { resources } = await this.container.items.query(querySpec).fetchAll();
            return {
                success: true,
                data: resources,
                count: resources.length
            };
        } catch (error) {
            console.error('Error querying items from Cosmos DB:', error);
            throw error;
        }
    }

    /**
     * Update a document
     * @param {string} id - Document ID
     * @param {object} item - Updated document
     */
    async updateItem(id, item) {
        try {
            await this.init();
            // Try Replace first
            try {
                const { resource } = await this.container.item(id, item.partitionKey).replace(item);
                return { success: true, data: resource };
            } catch (err) {
                // If 404 on replace, try Upsert which handles creation/replacement more flexibly
                if (err.code === 404) {
                    const { resource } = await this.container.items.upsert(item);
                    return { success: true, data: resource };
                }
                throw err;
            }
        } catch (error) {
            console.error('Error updating item in Cosmos DB:', error);
            throw error;
        }
    }

    /**
     * Delete a document
     * @param {string} id - Document ID
     * @param {string} partitionKey - Partition key value
     */
    async deleteItem(id, partitionKey) {
        try {
            await this.init();
            await this.container.item(id, partitionKey).delete();
            return {
                success: true,
                message: `Document ${id} deleted successfully`
            };
        } catch (error) {
            console.error('Error deleting item from Cosmos DB:', error);
            throw error;
        }
    }

    /**
     * Test connection to Cosmos DB
     */
    async testConnection() {
        try {
            await this.init();
            const { resource: dbInfo } = await this.database.read();
            const { resource: containerInfo } = await this.container.read();

            return {
                success: true,
                message: 'Connected to Cosmos DB successfully',
                database: dbInfo.id,
                container: containerInfo.id,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error testing Cosmos DB connection:', error);
            return {
                success: false,
                message: 'Failed to connect to Cosmos DB',
                error: error.message
            };
        }
    }
}

module.exports = new CosmosDbService();
