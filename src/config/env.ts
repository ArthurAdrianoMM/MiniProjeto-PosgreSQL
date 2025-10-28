import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = ['JWT_SECRET'];
  const missingVars: string[] = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security');
  }
};

// Validate environment variables
validateEnv();

// Detect if running in Docker
const isDocker = process.env.DOCKER_ENV === 'true' || process.env.MONGO_URI?.includes('mongo:27017');

// Use appropriate MongoDB host based on environment
const getDefaultMongoUri = () => {
    if (isDocker) {
        return 'mongodb://mongo:27017/userauth';
    }
    return 'mongodb://localhost:27017/userauth';
};

export const env = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    MONGO_URI: process.env.MONGO_URI || getDefaultMongoUri(),
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Additional configuration
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    
    // Database configuration
    DB_NAME: process.env.DB_NAME || 'userauth',
    
    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    
    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
