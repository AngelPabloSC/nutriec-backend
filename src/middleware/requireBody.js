const AppError = require('../utils/AppError');

/**
 * Middleware to ensure req.body exists.
 * Helps prevent crashes in Azure due to undefined body.
 */
module.exports = (req, res, next) => {
    // Check if body is undefined or null (express parsers usually set it to {})
    if (!req.body) {
        return next(new AppError('Request body is missing. Ensure Content-Type is correct (application/json or multipart/form-data).', 400));
    }
    next();
};
