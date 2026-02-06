const cosmosDb = require('../services/cosmosDb');
const UserModel = require('../models/UserModel');
const FoodRecordModel = require('../models/FoodRecordModel');

class CosmosDbRepository {
    constructor() {
        this.cosmosDbService = cosmosDb;
    }

    /**
     * Create a new document
     * Handles converting Domain Entity -> Persistence Model
     */
    async create(itemDomain) {
        try {
            let itemModel;



            if (itemDomain.password && itemDomain.email) {
                itemModel = UserModel.fromDomain(itemDomain);
            } else if (itemDomain.calories !== undefined) {
                itemModel = FoodRecordModel.fromDomain(itemDomain);
            } else {
                itemModel = itemDomain;
            }

            return await this.cosmosDbService.createItem(itemModel);
        } catch (error) {
            console.error('Repository error creating item:', error);
            throw error;
        }
    }

    /**
     * Find document by ID
     */
    async findById(id, partitionKey) {
        try {
            return await this.cosmosDbService.readItem(id, partitionKey);
        } catch (error) {
            console.error('Repository error finding item:', error);
            throw error;
        }
    }

    /**
     * Query documents with SQL query
     */
    async query(querySpec) {
        try {
            return await this.cosmosDbService.queryItems(querySpec);
        } catch (error) {
            console.error('Repository error querying items:', error);
            throw error;
        }
    }

    /**
     * Update a document
     */
    async update(id, item) {
        try {
            return await this.cosmosDbService.updateItem(id, item);
        } catch (error) {
            console.error('Repository error updating item:', error);
            throw error;
        }
    }

    /**
     * Delete a document
     */
    async delete(id, partitionKey) {
        try {
            return await this.cosmosDbService.deleteItem(id, partitionKey);
        } catch (error) {
            console.error('Repository error deleting item:', error);
            throw error;
        }
    }

    /**
     * Find food records by user ID
     */
    async findFoodRecordsByUserId(userId) {
        const query = {
            query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
            parameters: [{ name: '@userId', value: userId }]
        };
        const result = await this.query(query);
        return {
            ...result,
            data: result.data.map(item => FoodRecordModel.toDomain(new FoodRecordModel(item)))
        };
    }

    /**
     * Find food records by date range
     */
    async findFoodRecordsByDateRange(userId, startDate, endDate) {
        const query = {
            query: 'SELECT * FROM c WHERE c.userId = @userId AND c.date >= @startDate AND c.date <= @endDate ORDER BY c.date DESC',
            parameters: [
                { name: '@userId', value: userId },
                { name: '@startDate', value: startDate },
                { name: '@endDate', value: endDate }
            ]
        };
        const result = await this.query(query);
        return {
            ...result,
            data: result.data.map(item => FoodRecordModel.toDomain(new FoodRecordModel(item)))
        };
    }

    /**
     * Find user by email
     */
    async findUserByEmail(email) {
        const query = {
            query: 'SELECT * FROM c WHERE c.email = @email',
            parameters: [{ name: '@email', value: email }]
        };
        const result = await this.query(query);
        if (result.data.length > 0) {
            const userModel = new UserModel(result.data[0]);
            return UserModel.toDomain(userModel);
        }
        return null;
    }
}

module.exports = CosmosDbRepository;
