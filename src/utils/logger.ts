import morgan from "morgan";
import { Request, Response } from "express";

// Custom token for morgan to include timestamp
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Custom token for request ID (useful for tracing)
morgan.token('reqId', (req: Request) => {
  const reqId = req.headers['x-request-id'];
  return Array.isArray(reqId) ? reqId[0] : reqId || 'no-id';
});

// Custom format for development
const devFormat = ':timestamp [:reqId] :method :url :status :response-time ms - :res[content-length] bytes';

// Custom format for production
const prodFormat = ':timestamp [:reqId] :remote-addr :method :url :status :response-time ms :res[content-length]';

// Create logger based on environment
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return morgan(isDevelopment ? devFormat : prodFormat, {
    skip: (req: Request, res: Response) => {
      // Skip logging for health checks
      return req.url === '/health' || req.url === '/test';
    }
  });
};

export const logger = createLogger();

// Additional logging utilities
export const logInfo = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

export const logError = (message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`, error ? error.stack || error : '');
};

export const logWarn = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] WARN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

export const logSuccess = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SUCCESS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};
