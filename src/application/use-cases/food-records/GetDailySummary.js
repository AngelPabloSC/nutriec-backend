const FoodRecordModel = require('../../../infrastructure/models/FoodRecordModel');

class GetDailySummary {
    constructor(cosmosDbRepository) {
        this.cosmosDbRepository = cosmosDbRepository;
    }

    async execute(userId, date) {
        if (!userId || !date) {
            throw new Error('UserId and Date are required');
        }

        const userQuerySpec = {
            query: 'SELECT c.dailyCalories, c.macrosGoal FROM c WHERE c.id = @id',
            parameters: [{ name: '@id', value: userId }]
        };
        const userResult = await this.cosmosDbRepository.query(userQuerySpec);

        if (!userResult.data || userResult.data.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.data[0];
        const caloriesGoal = user.dailyCalories || 2000;

        const macrosGoal = user.macrosGoal || { proteins: 0, carbs: 0, fats: 0 };

        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;

        const foodQuerySpec = {
            query: 'SELECT * FROM c WHERE c.userId = @userId AND c.date >= @startDate AND c.date <= @endDate AND c.type = "foodRecord"',
            parameters: [
                { name: '@userId', value: userId },
                { name: '@startDate', value: startDate },
                { name: '@endDate', value: endDate }
            ]
        };

        const foodResult = await this.cosmosDbRepository.query(foodQuerySpec);
        const foodRecords = foodResult.data;



        let caloriesConsumed = 0;
        let proteinsConsumed = 0;
        let carbsConsumed = 0;
        let fatsConsumed = 0;

        foodRecords.forEach(record => {
            caloriesConsumed += record.calories || 0;
            if (record.macros) {
                proteinsConsumed += record.macros.proteins || 0;
                carbsConsumed += record.macros.carbs || 0;
                fatsConsumed += record.macros.fats || 0;
            }
        });


        const progress = caloriesGoal > 0 ? Math.min(caloriesConsumed / caloriesGoal, 1) : 0;

        return {
            caloriesConsumed: Math.round(caloriesConsumed),
            caloriesGoal: caloriesGoal,
            proteinsConsumed: parseFloat(proteinsConsumed.toFixed(1)),
            proteinsGoal: macrosGoal.proteins || 65.0,
            carbsConsumed: parseFloat(carbsConsumed.toFixed(1)),
            carbsGoal: macrosGoal.carbs || 265.0,
            fatsConsumed: parseFloat(fatsConsumed.toFixed(1)),
            fatsGoal: macrosGoal.fats || 107.0,
            progress: parseFloat(progress.toFixed(2))
        };
    }
}

module.exports = GetDailySummary;
