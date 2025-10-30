import { PrismaClient } from "@prisma/client";
import { logInfo, logError, logSuccess } from "../utils/logger";

export const prisma = new PrismaClient({
  log: ["error", "warn"],
});

export const connectDB = async () => {
  try {
    logInfo("Attempting to connect to PostgreSQL via Prisma");
    await prisma.$connect();
    logSuccess("Successfully connected to PostgreSQL");
  } catch (error) {
    logError("Failed to connect to PostgreSQL", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    logInfo("PostgreSQL connection closed");
  } catch (error) {
    logError("Error closing PostgreSQL connection", error);
  }
};
