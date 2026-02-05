const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

class ImageController {
    constructor(uploadFoodImageUseCase, analyzeFoodUseCase) {
        this.uploadFoodImageUseCase = uploadFoodImageUseCase;
        this.analyzeFoodUseCase = analyzeFoodUseCase;
    }

    upload = asyncHandler(async (req, res, next) => {
        const { userId } = req.body;
        const file = req.file;

        if (!userId) {
            return next(new AppError('Missing required field: userId', 400));
        }

        if (!file) {
            return next(new AppError('No file uploaded', 400));
        }

        const result = await this.uploadFoodImageUseCase.execute(userId, file);

        res.status(201).json(result);
    });

    analyze = asyncHandler(async (req, res, next) => {
        const file = req.file;

        if (!file) {
            return next(new AppError('No file provided for analysis', 400));
        }

        const result = await this.analyzeFoodUseCase.execute(file.buffer);

        res.status(200).json(result);
    });
}

module.exports = ImageController;
