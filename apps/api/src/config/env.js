export const env = {
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI,
  BASE_API_URL: process.env.BASE_API_URL || '/api',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}
