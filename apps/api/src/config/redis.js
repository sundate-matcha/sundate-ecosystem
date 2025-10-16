import Redis from 'ioredis'
import { env } from './env.js'

let redisClient = null

/**
 * Get or create Redis client instance
 * @returns {Redis|null} Redis client instance or null if Redis is not configured
 */
export function getRedisClient() {
  // Return existing client if already initialized
  if (redisClient) {
    return redisClient
  }

  // Check if Redis is configured
  if (!env.REDIS_URL) {
    console.warn('Redis not configured. Caching will be disabled.')
    return null
  }

  try {
    console.log('Connecting to Redis...')
    
    // Ensure connection string uses correct protocol for TLS
    let connectionUrl = env.REDIS_URL
    if (env.REDIS_TLS_ENABLED && connectionUrl.startsWith('redis://')) {
      connectionUrl = connectionUrl.replace('redis://', 'rediss://')
      console.log('⚠️  Converting redis:// to rediss:// for TLS connection')
    }
    
    const redisOptions = {
      maxRetriesPerRequest: 3,
      retryStrategy: times => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError: err => {
        const targetError = 'READONLY'
        if (err.message.includes(targetError)) {
          return true
        }
        return false
      }
    }

    // Enable TLS with relaxed certificate validation for cloud providers
    if (env.REDIS_TLS_ENABLED || connectionUrl.startsWith('rediss://')) {
      redisOptions.tls = {
        rejectUnauthorized: false
      }
    }

    redisClient = new Redis(connectionUrl, redisOptions)

    redisClient.on('connect', () => {
      console.log('✅ Redis client connected successfully')
    })

    redisClient.on('error', err => {
      console.error('❌ Redis client error:', err.message)
    })

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready to accept commands')
    })

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis client reconnecting...')
    })

    return redisClient
  } catch (error) {
    console.error('Failed to initialize Redis client:', error)
    return null
  }
}

/**
 * Close Redis connection
 */
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
    console.log('Redis connection closed')
  }
}

/**
 * Check if Redis is available
 * @returns {Promise<boolean>}
 */
export async function isRedisAvailable() {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.ping()
    return true
  } catch (error) {
    console.error('Redis not available:', error.message)
    return false
  }
}

export default getRedisClient
