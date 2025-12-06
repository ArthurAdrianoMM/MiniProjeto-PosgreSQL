import app from "../src/app";
import { connectDB } from "../src/database/connection";

// For Vercel serverless functions, Prisma connects lazily on first query
// We verify connection on first request, but don't block if it fails
// The actual query will handle connection errors appropriately
let connectionVerified = false;
let connectionVerificationPromise: Promise<void> | null = null;

const ensureConnection = async () => {
  // Only verify once per serverless function instance
  if (connectionVerified) {
    return;
  }

  // If verification is in progress, wait for it
  if (connectionVerificationPromise) {
    try {
      await connectionVerificationPromise;
    } catch (error) {
      // Connection verification failed, but don't block the request
      // The actual Prisma query will handle the error
      console.error("Connection verification failed (non-blocking):", error);
    }
    return;
  }

  // Start verification (non-blocking)
  connectionVerificationPromise = (async () => {
    try {
      await connectDB();
      connectionVerified = true;
    } catch (error) {
      console.error("Database connection verification error:", error);
      // Don't throw - let Prisma handle connection on first query
      // This allows the request to proceed and Prisma will attempt connection
    }
  })();

  // Wait for verification, but don't block if it fails
  try {
    await connectionVerificationPromise;
  } catch (error) {
    // Silently continue - Prisma will handle connection on first query
  }
};

// Verify connection on first request (non-blocking)
app.use(async (req, res, next) => {
  // Don't await - let it run in background
  ensureConnection().catch(() => {
    // Silently handle - Prisma will connect on first query
  });
  next();
});

// Export the app for Vercel serverless functions
export default app;

