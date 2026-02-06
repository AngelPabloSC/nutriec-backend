const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { cosmosDbRepository } = require('../../config/dependencies');

const protect = asyncHandler(async (req, res, next) => {
    let token;



    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }



    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user still exists
        // We need repository. But repository is in dependencies.js
        // We imported cosmosDbRepository above.

        // Wait, cosmosDbRepository.findById requires partitionKey potentially?
        // Or findUserByEmail?
        // The token has { id, role }.
        // We can query by ID. 
        // findById signature: (id, partitionKey). Cosmos structure usually uses (id, id) or specific PK.
        // Let's assume for User container default PK is /id (or similar).

        // Actually, let's try to query by ID directly using SQL if findById is ambiguous.
        // OR better: query via SQL "SELECT * FROM c WHERE c.id = @id"
        // cosmosDbRepository.query(...)

        const querySpec = {
            query: 'SELECT * FROM c WHERE c.id = @id',
            parameters: [{ name: '@id', value: decoded.id }]
        };

        const result = await cosmosDbRepository.query(querySpec);

        if (!result.data || result.data.length === 0) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }



        req.user = result.data[0];
        next();
    } catch (error) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
});

module.exports = { protect };
