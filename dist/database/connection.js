"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const connectDB = async () => {
    try {
        const uri = env_1.env.MONGO_URI;
        (0, logger_1.logInfo)("Attempting to connect to MongoDB", {
            uri: uri.replace(/\/\/.*@/, '//***@'), // Hide credentials in logs
            dbName: env_1.env.DB_NAME
        });
        await mongoose_1.default.connect(uri, {
            dbName: env_1.env.DB_NAME,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false // Disable mongoose buffering
        });
        (0, logger_1.logSuccess)("Successfully connected to MongoDB", {
            host: mongoose_1.default.connection.host,
            port: mongoose_1.default.connection.port,
            name: mongoose_1.default.connection.name,
            readyState: mongoose_1.default.connection.readyState
        });
        // Handle connection events
        mongoose_1.default.connection.on('error', (error) => {
            (0, logger_1.logError)("MongoDB connection error", error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            (0, logger_1.logError)("MongoDB disconnected");
        });
        mongoose_1.default.connection.on('reconnected', () => {
            (0, logger_1.logSuccess)("MongoDB reconnected");
        });
    }
    catch (error) {
        (0, logger_1.logError)("Failed to connect to MongoDB", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        (0, logger_1.logInfo)("MongoDB connection closed");
    }
    catch (error) {
        (0, logger_1.logError)("Error closing MongoDB connection", error);
    }
};
exports.disconnectDB = disconnectDB;
