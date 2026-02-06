class GetDetailedStatistics {
    constructor(cosmosDbRepository) {
        this.repository = cosmosDbRepository;
    }

    async execute(userId, days = 30) {
        if (!userId) {
            throw new Error('UserId is required');
        }

        const daysInt = parseInt(days);
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - daysInt);

        const startDate = pastDate.toISOString();
        const endDate = now.toISOString();

        // 1. Get User Data (Goals & Weight History)
        const userQuerySpec = {
            query: 'SELECT * FROM c WHERE c.id = @id',
            parameters: [{ name: '@id', value: userId }]
        };
        const userResult = await this.repository.query(userQuerySpec);

        if (!userResult.data || userResult.data.length === 0) {
            throw new Error('User not found');
        }
        const user = userResult.data[0];

        // 2. Get Food Records
        const foodResult = await this.repository.findFoodRecordsByDateRange(userId, startDate, endDate);
        const records = foodResult.data;

        // 3. Aggregate Daily Data
        const dailyMap = new Map();

        records.forEach(record => {
            const dateKey = record.date.split('T')[0]; // YYYY-MM-DD
            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, {
                    date: dateKey + 'T00:00:00Z',
                    consumed: 0,
                    goal: user.dailyCalories || 2000,
                    protein: 0,
                    carbs: 0,
                    fats: 0
                });
            }

            const day = dailyMap.get(dateKey);
            day.consumed += record.calories || 0;
            if (record.proteins) day.protein += record.proteins;
            if (record.carbs) day.carbs += record.carbs;
            if (record.fats) day.fats += record.fats;
        });

        const dailyData = Array.from(dailyMap.values()).map(d => ({
            ...d,
            consumed: Math.round(d.consumed),
            protein: Math.round(d.protein),
            carbs: Math.round(d.carbs),
            fats: Math.round(d.fats)
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4. Process Weight Data
        const weightHistory = user.weightHistory || [];
        // Sort weight history by date (oldest to newest for charts usually, but spec imply simple lists)
        // Spec: "weightData": [76.5, ...], "weightDates": ["2023...", ...]

        // Filter weight history by date range? Or return all?
        // Usually analytics show recent trends. Let's filter by the same 'days' window.
        const recentWeights = weightHistory.filter(w => new Date(w.date) >= pastDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending for charts

        const weightData = recentWeights.map(w => w.weight);
        const weightDates = recentWeights.map(w => w.date);

        // If no recent weights, maybe return current weight as a single point?
        // Let's stick to history. If empty, client handles it.

        return {
            dailyData,
            weightData,
            weightDates
        };
    }
}

module.exports = GetDetailedStatistics;
