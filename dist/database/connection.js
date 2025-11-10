"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
    log: ["error", "warn"],
});
const connectDB = async () => {
    try {
        (0, logger_1.logInfo)("Attempting to connect to PostgreSQL via Prisma");
        await exports.prisma.$connect();
        (0, logger_1.logSuccess)("Successfully connected to PostgreSQL");
    }
    catch (error) {
        (0, logger_1.logError)("Failed to connect to PostgreSQL", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await exports.prisma.$disconnect();
        (0, logger_1.logInfo)("PostgreSQL connection closed");
    }
    catch (error) {
        (0, logger_1.logError)("Error closing PostgreSQL connection", error);
    }
};
exports.disconnectDB = disconnectDB;
