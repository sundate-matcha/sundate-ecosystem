import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/sundate',
  BASE_API_URL: process.env.BASE_API_URL || '/api',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-jwt-refresh-key-change-this-in-production',
  
  // Notification settings
  ENABLE_PUSH_NOTIFICATIONS: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true' || true,
  NOTIFICATION_BATCH_SIZE: parseInt(process.env.NOTIFICATION_BATCH_SIZE) || 100,
  
  // Logging settings
  LOG_RETENTION_DAYS: parseInt(process.env.LOG_RETENTION_DAYS) || 90,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Redis settings
  REDIS_URL: process.env.REDIS_URL, // Connection string
  REDIS_TLS_ENABLED: process.env.REDIS_TLS_ENABLED === 'true' || false,
  REDIS_CACHE_TTL: parseInt(process.env.REDIS_CACHE_TTL) || 300, // 5 minutes default
}
