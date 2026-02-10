const User = require('../../../domain/entities/User');

class UpdateUserProfile {
    constructor(cosmosDbRepository, blobStorageRepository) {
        this.cosmosDbRepository = cosmosDbRepository;
        this.blobStorageRepository = blobStorageRepository;
    }

    async execute(userId, updateData, imageFile) {
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
            if (updateData.age) updatedFields.age = parseInt(updateData.age); // FormData sends strings
            if (updateData.gender) updatedFields.gender = updateData.gender;
            if (updateData.height) updatedFields.height = parseFloat(updateData.height);
            if (updateData.activityLevel) updatedFields.activityLevel = updateData.activityLevel;
            if (updateData.goal) updatedFields.goal = updateData.goal;

            // Handle Image Upload
            if (imageFile) {
                const extension = imageFile.originalname.split('.').pop() || 'png';
                const blobName = `users/${userId}/profile/avatar.${extension}`;

                // Upload buffer directly
                const uploadResult = await this.blobStorageRepository.uploadFile(
                    blobName,
                    imageFile.buffer,
                    imageFile.mimetype
                );
                updatedFields.profileImageUrl = uploadResult.url;
            }

            // 3. Handle Weight History
            const incomingWeight = updateData.weight || updateData.currentWeight;

            if (incomingWeight) {
                const newWeight = parseFloat(incomingWeight);
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

                // Calculate Macros Goal (Standard: 30% Protein, 40% Carbs, 30% Fat)
                // 1g Protein = 4 cal, 1g Carb = 4 cal, 1g Fat = 9 cal
                updatedFields.macrosGoal = {
                    proteins: Math.round((updatedFields.dailyCalories * 0.30) / 4),
                    carbs: Math.round((updatedFields.dailyCalories * 0.40) / 4),
                    fats: Math.round((updatedFields.dailyCalories * 0.30) / 9)
                };
            }

            // 5. Save using Update
            // Passing updatedFields.partitionKey allows replace optimization
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
