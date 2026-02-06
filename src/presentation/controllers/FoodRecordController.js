const AppError = require('../../presentation/utils/AppError');
const asyncHandler = require('../../presentation/utils/asyncHandler');

class FoodRecordController {
    constructor(createFoodRecordUseCase, getFoodRecordsUseCase, getDailySummaryUseCase, uploadFoodImageUseCase, getFoodHistoryUseCase, getDetailedStatisticsUseCase) {
        this.createFoodRecordUseCase = createFoodRecordUseCase;
        this.getFoodRecordsUseCase = getFoodRecordsUseCase;
        this.getDailySummaryUseCase = getDailySummaryUseCase;
        this.uploadFoodImageUseCase = uploadFoodImageUseCase;
        this.getFoodHistoryUseCase = getFoodHistoryUseCase;
        this.getDetailedStatisticsUseCase = getDetailedStatisticsUseCase;
    }

    create = asyncHandler(async (req, res, next) => {
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            return next(new AppError('User identifier not found', 401));
        }

        const { foodName, calories, proteins, carbs, fats, date, category, tags, time } = req.body;
        const imageFile = req.file;



        let finalImageUrl = req.body.imageUrl;

        if (imageFile) {
            const uploadResult = await this.uploadFoodImageUseCase.execute(userId, imageFile);
            if (uploadResult && uploadResult.data) {
                finalImageUrl = uploadResult.data.imageUrl;
            }
        }

        if (!foodName || calories === undefined) {
            return next(new AppError('Missing required fields: foodName, calories', 400));
        }

        let processedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                processedTags = tags;
            } else if (typeof tags === 'string') {
                const trimmed = tags.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    try {
                        processedTags = JSON.parse(trimmed);
                    } catch (e) {
                        processedTags = [trimmed];
                    }
                } else if (trimmed.includes(',')) {
                    processedTags = trimmed.split(',').map(t => t.trim()).filter(Boolean);
                } else {
                    processedTags = [trimmed];
                }
            }
        }

        const result = await this.createFoodRecordUseCase.execute({
            userId,
            foodName,
            calories: parseFloat(calories),
            proteins: proteins ? parseFloat(proteins) : 0,
            carbs: carbs ? parseFloat(carbs) : 0,
            fats: fats ? parseFloat(fats) : 0,
            imageUrl: finalImageUrl,
            date,
            category,
            tags: processedTags,
            time
        });

        res.status(201).json(result);
    });

    getAll = asyncHandler(async (req, res, next) => {
        const userId = req.user ? req.user.id : req.body.userId;
        const startDate = req.query.startDate || req.body.startDate;
        const endDate = req.query.endDate || req.body.endDate;
        const singleDate = req.query.date || req.body.date;

        if (!userId) {
            return next(new AppError('User identifier not found', 401));
        }

        const filters = {};

        if (singleDate) {
            filters.startDate = `${singleDate}T00:00:00.000Z`;
            filters.endDate = `${singleDate}T23:59:59.999Z`;
        } else {
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;
        }

        const result = await this.getFoodRecordsUseCase.execute(userId, filters);

        const mappedData = result.data.map(record => ({
            id: record.id,
            name: record.foodName,
            category: record.category,
            calories: record.calories,
            imageUrl: record.imageUrl,
            tags: record.tags,
            time: record.time
        }));

        res.status(200).json(mappedData);
    });

    getDailySummary = asyncHandler(async (req, res, next) => {
        const { date } = req.body;

        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return next(new AppError('User not authenticated.', 401));
        }

        if (!date) {
            return next(new AppError('Missing required parameter: date (YYYY-MM-DD)', 400));
        }

        const result = await this.getDailySummaryUseCase.execute(userId, date);

        res.status(200).json(result);
    });

    getHistory = asyncHandler(async (req, res, next) => {
        const userId = req.user ? req.user.id : req.body.userId;

        const startDate = req.query.startDate || req.body.startDate;
        const endDate = req.query.endDate || req.body.endDate;

        if (!userId) {
            return next(new AppError('User identifier not found', 401));
        }

        if (!startDate || !endDate) {
            return next(new AppError('Missing required parameters: startDate and endDate', 400));
        }

        const result = await this.getFoodHistoryUseCase.execute(userId, startDate, endDate);

        res.status(200).json(result);
    });

    getDetailedStats = asyncHandler(async (req, res, next) => {
        const userId = req.user ? req.user.id : req.body.userId;
        const days = req.query.days || req.body.days || 30;

        if (!userId) {
            return next(new AppError('User identifier not found', 401));
        }

        const result = await this.getDetailedStatisticsUseCase.execute(userId, days);

        res.status(200).json(result);
    });
}

module.exports = FoodRecordController;
