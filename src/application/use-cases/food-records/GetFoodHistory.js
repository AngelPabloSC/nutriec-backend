class GetFoodHistory {
    constructor(cosmosDbRepository) {
        this.repository = cosmosDbRepository;
    }

    async execute(userId, startDate, endDate) {
        if (!userId || !startDate || !endDate) {
            throw new Error('UserId, StartDate, and EndDate are required');
        }

        // 1. Get raw records from DB
        // Append time to ensure full day coverage
        const startISO = `${startDate}T00:00:00.000Z`;
        const endISO = `${endDate}T23:59:59.999Z`;

        const result = await this.repository.findFoodRecordsByDateRange(userId, startISO, endISO);
        const records = result.data;

        // 2. Group by Date
        const groupedMap = new Map();

        records.forEach(record => {
            // Extract YYYY-MM-DD from ISO string
            // Note: DB stores UTC. We group by the date string provided in the record.
            // If the record date is "2023-10-27T13:30:00.000Z", the key is "2023-10-27"
            const dateKey = record.date.split('T')[0];

            if (!groupedMap.has(dateKey)) {
                groupedMap.set(dateKey, {
                    date: record.date.split('T')[0] + 'T00:00:00Z', // Spec format "2023-10-27T00:00:00Z"
                    totalCalories: 0,
                    totalProtein: 0,
                    totalCarbs: 0,
                    totalFats: 0,
                    meals: []
                });
            }

            const dayGroup = groupedMap.get(dateKey);

            // Accumulate Macros
            dayGroup.totalCalories += record.calories || 0;
            dayGroup.totalProtein += record.proteins || 0;
            dayGroup.totalCarbs += record.carbs || 0;
            dayGroup.totalFats += record.fats || 0;

            // Add Meal (mapped to spec)
            dayGroup.meals.push({
                id: record.id,
                name: record.foodName,
                category: record.category || 'Snack',
                calories: record.calories,
                imageUrl: record.imageUrl,
                tags: record.tags || [],
                time: record.time || '00:00'
            });
        });

        // 3. Format result as array
        const history = Array.from(groupedMap.values()).map(day => ({
            ...day,
            totalCalories: Math.round(day.totalCalories),
            totalProtein: Math.round(day.totalProtein),
            totalCarbs: Math.round(day.totalCarbs),
            totalFats: Math.round(day.totalFats)
        }));

        // Sort by date descending (newest first)
        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        return history;
    }
}

module.exports = GetFoodHistory;
