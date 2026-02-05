const User = require('../../domain/entities/User');

class UpdateUserProfile {
    constructor(cosmosDbRepository) {
        this.cosmosDbRepository = cosmosDbRepository;
    }

    async execute(userId, updateData) {
        // 1. Get current user via Query (Cross-partition safe)
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.id = @id',
            parameters: [{ name: '@id', value: userId }]
        };

        let currentUserData;

        try {
            const result = await this.cosmosDbRepository.query(querySpec);

            if (!result.data || result.data.length === 0) {
                throw new Error('User not found');
            }

            currentUserData = result.data[0];

            // 2. Prepare updates
            const updatedFields = { ...currentUserData };

            // Update simple fields
            if (updateData.name) updatedFields.name = updateData.name;
            if (updateData.age) updatedFields.age = updateData.age;
            if (updateData.gender) updatedFields.gender = updateData.gender;
            if (updateData.height) updatedFields.height = updateData.height;
            if (updateData.activityLevel) updatedFields.activityLevel = updateData.activityLevel;
            if (updateData.goal) updatedFields.goal = updateData.goal;

            // 3. Handle Weight History
            if (updateData.weight) {
                const newWeight = parseFloat(updateData.weight);
                const currentWeight = updatedFields.currentWeight || 0;

                if (newWeight !== currentWeight) {
                    updatedFields.currentWeight = newWeight;

                    const historyEntry = {
                        date: new Date().toISOString(),
                        weight: newWeight,
                        month: new Date().toLocaleString('default', { month: 'short' }).toUpperCase()
                    };

                    if (!updatedFields.weightHistory) updatedFields.weightHistory = [];
                    updatedFields.weightHistory.push(historyEntry);
                }
            }

            // 4. Calculate Calories
            if (updatedFields.currentWeight && updatedFields.height && updatedFields.age && updatedFields.gender) {
                let bmr = (10 * updatedFields.currentWeight) + (6.25 * updatedFields.height) - (5 * updatedFields.age);
                bmr += (updatedFields.gender.toLowerCase() === 'male') ? 5 : -161;

                const multipliers = {
                    'sedentary': 1.2,
                    'light': 1.375,
                    'moderate': 1.55,
                    'active': 1.725
                };
                const multiplier = multipliers[updatedFields.activityLevel] || 1.2;

                let calories = bmr * multiplier;
                if (updatedFields.goal === 'lose_weight') calories -= 500;
                if (updatedFields.goal === 'gain_weight') calories += 500;

                updatedFields.dailyCalories = Math.round(calories);
            }

            // 5. Explicitly preserve internal Cosmos system fields to avoid "Replace" creating a new document mistakenly
            // DELETE unneeded system fields that update might reject if trying to modify read-only props
            // Actually, for upsert with same ID, we just need ID and partition key in the body.

            // ATTEMPT TO FIND REAL PARTITION KEY
            // If the collection is partitioned by something else, we might need it.
            // Using logic: If property exists in data and is used as PK, we need to keep it.
            // We already copied {...currentUserData} so we have all fields.

            // 6. Save using Update (which now tries Replace -> Upsert)
            // Passing updatedFields.partitionKey allows the service to try explicit replacement.
            // If that fails, it will upsert based on the body content.

            const updateResult = await this.cosmosDbRepository.update(userId, updatedFields);

            // Return safe user data
            const { password, _rid, _self, _etag, _attachments, _ts, ...safeUserData } = updateResult.data;

            return {
                success: true,
                data: safeUserData
            };

        } catch (error) {
            console.error('UpdateUserProfile Error:', error);
            throw error;
        }
    }
}

module.exports = UpdateUserProfile;
