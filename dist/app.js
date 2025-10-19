"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./utils/logger");
const logger_2 = require("./utils/logger");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const env_1 = require("./config/env");
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: env_1.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging middleware
app.use(logger_1.logger);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV
    });
});
// API routes
app.use("/api", user_routes_1.default);
// Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The requested route ${req.originalUrl} does not exist`,
        availableRoutes: [
            'GET /health',
            'GET /test',
            'POST /api/register',
            'POST /api/login',
            'GET /api/protected'
        ]
    });
});
// Global error handler
app.use((err, req, res, next) => {
    (0, logger_2.logError)('Unhandled error in application', err);
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: env_1.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        ...(env_1.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
exports.default = app;
