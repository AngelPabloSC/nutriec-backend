const asyncHandler = require('../../presentation/utils/asyncHandler');
const AppError = require('../../presentation/utils/AppError');

class UserController {
    constructor(getUserProfileUseCase, updateUserProfileUseCase) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
    }

    getProfile = asyncHandler(async (req, res, next) => {
        // User ID comes from authMiddleware (req.user.id)
        if (!req.user || !req.user.id) {
            return next(new AppError('User identifier not found', 401));
        }

        const profile = await this.getUserProfileUseCase.execute(req.user.id);

        res.status(200).json({
            success: true,
            data: profile
        });
    });

    updateProfile = asyncHandler(async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return next(new AppError('User identifier not found', 401));
        }

        const updateData = req.body;
        const imageFile = req.file;

        // Basic validation could go here, or in use case

        const result = await this.updateUserProfileUseCase.execute(req.user.id, updateData, imageFile);

        res.status(200).json(result);
    });
}

module.exports = UserController;
