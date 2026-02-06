const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    register = asyncHandler(async (req, res, next) => {
        const { name, email, password } = req.body;
        const imageFile = req.file; // Multer puts file here

        if (!name || !email || !password) {
            return next(new AppError('Missing required fields: name, email, password', 400));
        }

        try {
            const result = await this.registerUserUseCase.execute({
                name,
                email,
                password,
                password,
                imageFile
            });

            res.status(201).json(result);
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw new AppError(error.message, 409);
            }
            throw error;
        }
    });

    login = asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Missing required fields: email, password', 400));
        }

        try {
            const result = await this.loginUserUseCase.execute({ email, password });
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                throw new AppError('Invalid email or password', 401);
            }
            throw error;
        }
    });
}

module.exports = AuthController;
