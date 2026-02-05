const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

class FoodRecordController {
    constructor(createFoodRecordUseCase, getFoodRecordsUseCase) {
        this.createFoodRecordUseCase = createFoodRecordUseCase;
        this.getFoodRecordsUseCase = getFoodRecordsUseCase;
    }

    create = asyncHandler(async (req, res, next) => {
        const { userId, foodName, calories, proteins, carbs, fats, imageUrl, date } = req.body;

        if (!userId || !foodName || calories === undefined) {
            return next(new AppError('Missing required fields: userId, foodName, calories', 400));
        }

        const result = await this.createFoodRecordUseCase.execute({
            userId,
            foodName,
            calories: parseFloat(calories),
            proteins: proteins ? parseFloat(proteins) : 0,
            carbs: carbs ? parseFloat(carbs) : 0,
            fats: fats ? parseFloat(fats) : 0,
            imageUrl,
            date
        });

        res.status(201).json(result);
    });

    getAll = asyncHandler(async (req, res, next) => {
        // Changed to req.body for POST request security preference
        const { userId, startDate, endDate } = req.body;

        if (!userId) {
            return next(new AppError('Missing required parameter: userId', 400));
        }

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const result = await this.getFoodRecordsUseCase.execute(userId, filters);

        res.status(200).json(result);
    });
}

module.exports = FoodRecordController;
