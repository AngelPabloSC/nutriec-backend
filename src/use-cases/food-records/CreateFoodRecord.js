const FoodRecord = require('../../domain/entities/FoodRecord');

class CreateFoodRecord {
    constructor(cosmosDbRepository) {
        this.repository = cosmosDbRepository;
    }

    async execute(foodRecordData) {
        try {
            // Create domain entity
            const foodRecord = new FoodRecord({
                id: Date.now().toString(),
                ...foodRecordData,
                createdAt: new Date().toISOString()
            });

            // Validate
            foodRecord.validate();

            // Save to database
            const result = await this.repository.create(foodRecord.toJSON());

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Error in CreateFoodRecord use case:', error);
            throw error;
        }
    }
}

module.exports = CreateFoodRecord;
