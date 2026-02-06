const express = require('express');
const cors = require('cors');
require('dotenv').config();

const corsOptions = require('./src/config/cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// DEBUG: Log incoming requests for Azure debugging
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log('[HEADERS]', JSON.stringify(req.headers));
    console.log('[BODY]', JSON.stringify(req.body));
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a Nutriec Backend API',
        version: '2.0.0',
        status: 'running',
        architecture: 'Clean Architecture'
    });
});

// Health check endpoint
// Health check endpoint
const healthCheck = (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
};
app.get('/health', healthCheck);
app.get('/api/v1/health', healthCheck);

// API Routes
const authRoutes = require('./src/routes/auth');
const foodRecordRoutes = require('./src/routes/foodRecords');
const imageRoutes = require('./src/routes/images');
const userRoutes = require('./src/routes/user');
// const testRoutes = require('./src/routes/test'); // Enabled for debug

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/food-records', foodRecordRoutes);
app.use('/api/images', imageRoutes);
// app.use('/api/test', testRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
