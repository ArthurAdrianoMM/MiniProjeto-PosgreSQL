import { PrismaClient } from "@prisma/client";
import { logInfo, logError, logSuccess } from "../utils/logger";

export const prisma = new PrismaClient({
  log: ["error", "warn"],
});

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

export const connectDB = async () => {
  // If already connecting, wait for that connection
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // If not connecting, start a new connection
  if (!isConnecting) {
    isConnecting = true;
    connectionPromise = (async () => {
      try {
        logInfo("Attempting to connect to PostgreSQL via Prisma");
        await prisma.$connect();
        logSuccess("Successfully connected to PostgreSQL");
      } catch (error) {
        logError("Failed to connect to PostgreSQL", error);
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

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    logInfo("PostgreSQL connection closed");
  } catch (error) {
    logError("Error closing PostgreSQL connection", error);
  }
};
