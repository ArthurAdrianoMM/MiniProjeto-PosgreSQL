import { PrismaClient } from "@prisma/client";
import { logInfo, logError, logSuccess } from "../utils/logger";

// Prisma Client configuration optimized for serverless (Vercel)
// Connection pooling is handled by Supabase connection pooler (port 6543)
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error", "warn"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

export const connectDB = async () => {
  // In serverless environments, Prisma connects lazily on first query
  // We just verify the connection is possible
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  if (!isConnecting) {
    isConnecting = true;
    connectionPromise = (async () => {
      try {
        logInfo("Verifying PostgreSQL connection via Prisma");
        // In serverless, we don't need to explicitly connect
        // Prisma will connect on first query, but we can verify with a simple query
        await prisma.$queryRaw`SELECT 1`;
        logSuccess("PostgreSQL connection verified");
      } catch (error: any) {
        logError("Failed to connect to PostgreSQL", error);
        isConnecting = false;
        connectionPromise = null;
        
        // Provide helpful error message
        if (error.message?.includes("Can't reach database server")) {
          const dbUrl = process.env.DATABASE_URL || "";
          if (!dbUrl.includes("sslmode=require")) {
            logError("DATABASE_URL missing SSL parameter. Add ?sslmode=require to connection string");
          }
          if (dbUrl.includes(":5432") && !dbUrl.includes(":6543")) {
            logError("Consider using connection pooler port 6543 for serverless (instead of 5432)");
          }
        }
        
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
