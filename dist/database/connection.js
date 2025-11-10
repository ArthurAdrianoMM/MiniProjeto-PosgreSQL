"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
    log: ["error", "warn"],
});
let isConnecting = false;
let connectionPromise = null;
const connectDB = async () => {
    // If already connecting, wait for that connection
    if (isConnecting && connectionPromise) {
        return connectionPromise;
    }
    // If not connecting, start a new connection
    if (!isConnecting) {
        isConnecting = true;
        connectionPromise = (async () => {
            try {
                (0, logger_1.logInfo)("Attempting to connect to PostgreSQL via Prisma");
                await exports.prisma.$connect();
                (0, logger_1.logSuccess)("Successfully connected to PostgreSQL");
            }
            catch (error) {
                (0, logger_1.logError)("Failed to connect to PostgreSQL", error);
                isConnecting = false;
                connectionPromise = null;
                // Don't exit in serverless environments (Vercel)
                if (process.env.VERCEL !== "1") {
                    process.exit(1);
                }
                throw error;
            }
        })();
    }
    return connectionPromise;
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
