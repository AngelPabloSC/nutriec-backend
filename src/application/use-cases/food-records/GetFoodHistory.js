class GetFoodHistory {
    constructor(cosmosDbRepository) {
        this.repository = cosmosDbRepository;
    }

    async execute(userId, startDate, endDate) {
        if (!userId || !startDate || !endDate) {
            throw new Error('UserId, StartDate, and EndDate are required');
        }

        const startISO = `${startDate}T00:00:00.000Z`;
        const endISO = `${endDate}T23:59:59.999Z`;

        const result = await this.repository.findFoodRecordsByDateRange(userId, startISO, endISO);
        const records = result.data;

        const groupedMap = new Map();

        records.forEach(record => {
            const dateKey = record.date.split('T')[0];

            if (!groupedMap.has(dateKey)) {
                groupedMap.set(dateKey, {
                    date: record.date.split('T')[0] + 'T00:00:00Z',
                    totalCalories: 0,
                    totalProtein: 0,
                    totalCarbs: 0,
                    totalFats: 0,
                    meals: []
                });
            }

            const dayGroup = groupedMap.get(dateKey);

            dayGroup.totalCalories += record.calories || 0;
            dayGroup.totalProtein += record.proteins || 0;
            dayGroup.totalCarbs += record.carbs || 0;
            dayGroup.totalFats += record.fats || 0;

            dayGroup.meals.push({
                id: record.id,
                name: record.foodName,
                category: record.category || 'Snack',
                calories: record.calories,
                macros: {
                    proteins: record.proteins,
                    carbs: record.carbs,
                    fats: record.fats
                },
                imageUrl: record.imageUrl,
                tags: record.tags || [],
                time: record.time || '00:00'
            });
        });

        const history = Array.from(groupedMap.values()).map(day => ({
            ...day,
            totalCalories: Math.round(day.totalCalories),
            totalProtein: Math.round(day.totalProtein),
            totalCarbs: Math.round(day.totalCarbs),
            totalFats: Math.round(day.totalFats)
        }));

        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        return history;
    }
}

module.exports = GetFoodHistory;
