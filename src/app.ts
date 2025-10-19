import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { logger } from "./utils/logger";
import { logError } from "./utils/logger";
import userRoutes from "./routes/user.routes";
import { env } from "./config/env";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV
  });
});

// API routes
app.use("/api", userRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /health',
      'GET /test',
      'POST /api/register',
      'POST /api/login',
      'GET /api/protected'
    ]
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logError('Unhandled error in application', err);
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
