import mongoose from "mongoose";
import { env } from "../config/env";
import { logInfo, logError, logSuccess } from "../utils/logger";

export const connectDB = async () => {
  try {
    const uri = env.MONGO_URI;
    
    logInfo("Attempting to connect to MongoDB", { 
      uri: uri.replace(/\/\/.*@/, '//***@'), // Hide credentials in logs
      dbName: env.DB_NAME 
    });

    await mongoose.connect(uri, {
      dbName: env.DB_NAME,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false // Disable mongoose buffering
    });

    logSuccess("Successfully connected to MongoDB", {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logError("MongoDB connection error", error);
    });

    mongoose.connection.on('disconnected', () => {
      logError("MongoDB disconnected");
    });

    mongoose.connection.on('reconnected', () => {
      logSuccess("MongoDB reconnected");
    });

  } catch (error) {
    logError("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logInfo("MongoDB connection closed");
  } catch (error) {
    logError("Error closing MongoDB connection", error);
  }
};
