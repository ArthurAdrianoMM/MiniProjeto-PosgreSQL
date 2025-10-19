"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSuccess = exports.logWarn = exports.logError = exports.logInfo = exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
// Custom token for morgan to include timestamp
morgan_1.default.token('timestamp', () => {
    return new Date().toISOString();
});
// Custom token for request ID (useful for tracing)
morgan_1.default.token('reqId', (req) => {
    const reqId = req.headers['x-request-id'];
    return Array.isArray(reqId) ? reqId[0] : reqId || 'no-id';
});
// Custom format for development
const devFormat = ':timestamp [:reqId] :method :url :status :response-time ms - :res[content-length] bytes';
// Custom format for production
const prodFormat = ':timestamp [:reqId] :remote-addr :method :url :status :response-time ms :res[content-length]';
// Create logger based on environment
const createLogger = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return (0, morgan_1.default)(isDevelopment ? devFormat : prodFormat, {
        skip: (req, res) => {
            // Skip logging for health checks
            return req.url === '/health' || req.url === '/test';
        }
    });
};
exports.logger = createLogger();
// Additional logging utilities
const logInfo = (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};
exports.logInfo = logInfo;
const logError = (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error ? error.stack || error : '');
};
exports.logError = logError;
const logWarn = (message, data) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};
exports.logWarn = logWarn;
const logSuccess = (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SUCCESS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};
exports.logSuccess = logSuccess;
