export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/sundate',
  BASE_API_URL: process.env.BASE_API_URL || '/api',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-jwt-refresh-key-change-this-in-production',
}
