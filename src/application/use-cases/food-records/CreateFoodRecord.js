const FoodRecord = require('../../../domain/entities/FoodRecord');

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

            // --- Streak Logic Start ---
            try {
                const userId = foodRecord.userId; 
                const querySpec = {
                    query: 'SELECT * FROM c WHERE c.id = @id',
                    parameters: [{ name: '@id', value: userId }]
                };
                const userResult = await this.repository.query(querySpec);

                if (userResult.data && userResult.data.length > 0) {
                    const user = userResult.data[0];
                    const today = new Date().toISOString().split('T')[0];
                    const lastActivityDate = user.lastActivityDate ? user.lastActivityDate.split('T')[0] : null;

                    if (lastActivityDate !== today) {
                        let newStreak = user.streak || 0;

                        if (lastActivityDate) {
                            const lastDate = new Date(lastActivityDate);
                            const currentDate = new Date(today);
                            const diffTime = Math.abs(currentDate - lastDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays === 1) {
                                newStreak++;
                            } else {
                                newStreak = 1; // Reset if missed a day
                            }
                        } else {
                            newStreak = 1; // First time
                        }

                        // Update User
                        user.streak = newStreak;
                        user.lastActivityDate = new Date().toISOString();

                        // We need to persist this. CosmosDbRepository.update takes id and item.
                        await this.repository.update(userId, user);
                    }
                }
            } catch (streakError) {
                console.error('Error updating streak:', streakError);
                // Don't fail the food record creation if streak update fails
            }
            // --- Streak Logic End ---

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
