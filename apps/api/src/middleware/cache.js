import { generateCacheKey, getCache, setCache } from '../utils/cacheHelpers.js'
import { env } from '../config/env.js'

/**
 * Cache middleware for GET requests
 * Caches the response and serves from cache on subsequent requests
 * 
 * @param {Object} options - Middleware options
 * @param {string} options.prefix - Cache key prefix (required)
 * @param {number} options.ttl - Time to live in seconds (optional, defaults to env.REDIS_CACHE_TTL)
 * @param {Function} options.keyGenerator - Custom key generator function (optional)
 * @returns {Function} Express middleware
 */
export function cacheMiddleware(options = {}) {
  const { prefix, ttl = env.REDIS_CACHE_TTL, keyGenerator } = options

  if (!prefix) {
    throw new Error('Cache prefix is required')
  }

  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator ? keyGenerator(req) : generateCacheKey(prefix, req)

      // Try to get data from cache
      const cachedData = await getCache(cacheKey)

      if (cachedData) {
        console.log(`✨ Cache hit: ${cacheKey}`)
        return res.json(cachedData)
      }

      console.log(`⏭️  Cache miss: ${cacheKey}`)

      // Store original res.json
      const originalJson = res.json.bind(res)

      // Override res.json to cache the response
      res.json = function (data) {
        // Only cache successful responses (status 200)
        if (res.statusCode === 200) {
          setCache(cacheKey, data, ttl)
            .then(() => {
              console.log(`💾 Cached: ${cacheKey} (TTL: ${ttl}s)`)
            })
            .catch(err => {
              console.error('Failed to cache response:', err)
            })
        }

        // Call original json method
        return originalJson(data)
      }

      next()
    } catch (error) {
      console.error('Cache middleware error:', error)
      // Continue without caching on error
      next()
    }
  }
}

/**
 * Cache invalidation middleware
 * Invalidates cache when data is modified (POST, PUT, PATCH, DELETE)
 * 
 * @param {Object} options - Middleware options
 * @param {string} options.resource - Resource name to invalidate
 * @param {Function} options.invalidateOn - Custom invalidation function (optional)
 * @returns {Function} Express middleware
 */
export function invalidateCacheMiddleware(options = {}) {
  const { resource, invalidateOn } = options

  if (!resource && !invalidateOn) {
    throw new Error('Either resource or invalidateOn function is required')
  }

  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json.bind(res)

    // Override res.json to invalidate cache after successful response
    res.json = function (data) {
      // Only invalidate on successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (invalidateOn) {
          invalidateOn(req, res, data).catch(err => {
            console.error('Failed to invalidate cache:', err)
          })
        } else if (resource) {
          import('../utils/cacheHelpers.js')
            .then(module => module.invalidateResourceCache(resource))
            .catch(err => {
              console.error('Failed to invalidate resource cache:', err)
            })
        }
      }

      // Call original json method
      return originalJson(data)
    }

    next()
  }
}

export default {
  cacheMiddleware,
  invalidateCacheMiddleware
}

