import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];
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
export const env = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Additional configuration
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    
    // Database configuration (PostgreSQL)
    DB_NAME: process.env.DB_NAME || 'postgres',
    
    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    
    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
