class GetUserProfile {
    constructor(cosmosDbRepository) {
        this.cosmosDbRepository = cosmosDbRepository;
    }

    async execute(userId) {
        // Use Query instead of findById to match middleware success pattern
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.id = @id',
            parameters: [{ name: '@id', value: userId }]
        };

        const result = await this.cosmosDbRepository.query(querySpec);

        if (!result.data || result.data.length === 0) {
            throw new Error('User not found');
        }

        const userData = result.data[0];

        // Derived Logic
        const weightHistory = userData.weightHistory || [];
        const currentWeight = userData.currentWeight || 0;
        let weightChange = 0;
        let weightChangePercent = 0;

        if (weightHistory.length > 0) {
            // Assuming sorted? Usually append order.
            // Compare current vs first recorded? Or previous?
            // "Change" usually implies "Total Change".
            const initialWeight = weightHistory[0].weight;
            weightChange = currentWeight - initialWeight;
            if (initialWeight > 0) {
                weightChangePercent = (weightChange / initialWeight) * 100;
            }
        }

        // Format user-facing profile
        return {
            name: userData.name,
            location: "Quito, Ecuador",
            avatarUrl: userData.profileImageUrl,
            badge: "NUTRIEC MEMBER",
            currentWeight: parseFloat((userData.currentWeight || 0).toFixed(1)),
            dailyCalories: userData.dailyCalories || 2000,
            streak: userData.streak || 0,
            weightChange: parseFloat(weightChange.toFixed(1)),
            weightChangePercent: parseFloat(weightChangePercent.toFixed(1)),
            weightHistory: userData.weightHistory || []
        };
    }
}

module.exports = GetUserProfile;
