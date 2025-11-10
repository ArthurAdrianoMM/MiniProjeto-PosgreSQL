import app from "../src/app";
import { connectDB } from "../src/database/connection";

// Initialize database connection for serverless
let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection error:", error);
      // Don't exit in serverless - let the request handle the error
    }
  }
};

// Connect to database before handling requests
app.use(async (req, res, next) => {
  await ensureConnection();
  next();
});

// Export the app for Vercel serverless functions
export default app;

