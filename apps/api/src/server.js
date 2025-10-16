import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { env } from './config/env.js'
import { getRedisClient, isRedisAvailable } from './config/redis.js'

// Import routes
import reservationRoutes from './routes/reservations.js'
import contactRoutes from './routes/contact.js'
import authRoutes from './routes/auth.js'
import tableCategoryRoutes from './routes/table-categories.js'
import pushTokenRoutes from './routes/pushTokens.js'
import logRoutes from './routes/logs.js'
import notificationRoutes from './routes/notifications.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = env.PORT || 5001
const BASE_URL = env.BASE_API_URL || '/api'

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(`${BASE_URL}/`, limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(morgan('combined'))

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

// Redis connection
const connectRedis = async () => {
  try {
    const redis = getRedisClient()
    if (redis) {
      const available = await isRedisAvailable()
      if (available) {
        console.log('✅ Redis Connected and ready')
      } else {
        console.warn('⚠️  Redis client initialized but not responding')
      }
    } else {
      console.warn('⚠️  Redis not configured - caching disabled')
    }
  } catch (error) {
    console.error('⚠️  Redis connection error:', error.message)
    console.log('Continuing without Redis caching...')
  }
}

// Routes
app.use(`${BASE_URL}/auth`, authRoutes)
app.use(`${BASE_URL}/contact`, contactRoutes)
app.use(`${BASE_URL}/logs`, logRoutes)
app.use(`${BASE_URL}/notifications`, notificationRoutes)
app.use(`${BASE_URL}/push-tokens`, pushTokenRoutes)
app.use(`${BASE_URL}/reservations`, reservationRoutes)
app.use(`${BASE_URL}/table-categories`, tableCategoryRoutes)

// Health check endpoint
app.get(`${BASE_URL}/health`, async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  const redisStatus = await isRedisAvailable() ? 'connected' : 'disconnected'
  
  res.json({
    status: 'OK',
    message: 'Sundate Matcha API is running',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoStatus,
      redis: redisStatus
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
const startServer = async () => {
  await connectDB()
  await connectRedis()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📱 Environment: ${env.NODE_ENV}`)
    console.log(`🌐 Health check: http://localhost:${PORT}${BASE_URL}/health`)
  })
}

startServer().catch(console.error)

export default app
