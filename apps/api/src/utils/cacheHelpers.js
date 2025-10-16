import getRedisClient from '../config/redis.js'
import { env } from '../config/env.js'

/**
 * Generate a cache key from request details
 * @param {string} prefix - Cache key prefix (e.g., 'reservations', 'users')
 * @param {Object} req - Express request object
 * @returns {string} Generated cache key
 */
export function generateCacheKey(prefix, req) {
  const { path, query, params } = req
  const queryString = new URLSearchParams(query).toString()
  const paramsString = Object.values(params).join('/')
  
  return `${prefix}:${path}:${paramsString}:${queryString}`
}

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached data or null if not found
 */
export async function getCache(key) {
  const redis = getRedisClient()
  if (!redis) return null

  try {
    const cachedData = await redis.get(key)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
    return null
  } catch (error) {
    console.error('Error getting cache:', error)
    return null
  }
}

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (default: from env)
 * @returns {Promise<boolean>} Success status
 */
export async function setCache(key, data, ttl = env.REDIS_CACHE_TTL) {
  const redis = getRedisClient()
  if (!redis) return false

  try {
    await redis.setex(key, ttl, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error setting cache:', error)
    return false
  }
}

/**
 * Delete a specific cache key
 * @param {string} key - Cache key to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteCache(key) {
  const redis = getRedisClient()
  if (!redis) return false

  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error('Error deleting cache:', error)
    return false
  }
}

/**
 * Delete all cache keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'reservations:*')
 * @returns {Promise<number>} Number of keys deleted
 */
export async function deleteCachePattern(pattern) {
  const redis = getRedisClient()
  if (!redis) return 0

  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      const deleted = await redis.del(...keys)
      console.log(`🗑️  Invalidated ${deleted} cache keys matching: ${pattern}`)
      return deleted
    }
    return 0
  } catch (error) {
    console.error('Error deleting cache pattern:', error)
    return 0
  }
}

/**
 * Invalidate all caches for a specific resource
 * @param {string} resource - Resource name (e.g., 'reservations')
 * @returns {Promise<number>} Number of keys deleted
 */
export async function invalidateResourceCache(resource) {
  return await deleteCachePattern(`${resource}:*`)
}

/**
 * Clear all cache
 * @returns {Promise<boolean>} Success status
 */
export async function clearAllCache() {
  const redis = getRedisClient()
  if (!redis) return false

  try {
    await redis.flushdb()
    console.log('🗑️  All cache cleared')
    return true
  } catch (error) {
    console.error('Error clearing all cache:', error)
    return false
  }
}

export default {
  generateCacheKey,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  invalidateResourceCache,
  clearAllCache
}

