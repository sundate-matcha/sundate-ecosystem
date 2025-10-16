# Redis Caching Implementation

This document describes the Redis caching implementation for the Sundate API Gateway.

## Overview

Redis caching has been implemented to improve API performance by caching GET endpoint responses, especially for reservation and table category data. The implementation uses **ioredis** as the Redis client and provides automatic cache invalidation on data mutations.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Redis Configuration
REDIS_URL=redis://username:password@host:port
REDIS_TLS_ENABLED=true
REDIS_CACHE_TTL=300
```

**Example:**
```env
REDIS_URL=rediss://default:your-password@r-14571.redis-cloud.com:14571
REDIS_TLS_ENABLED=true
REDIS_CACHE_TTL=300
```

**Configuration Options:**
- **REDIS_URL**: Full Redis connection string (includes username, password, host, port). Required for Redis caching.
- **REDIS_TLS_ENABLED**: Enable TLS for secure connections (required for cloud Redis providers like cloud.redis.io)
- **REDIS_CACHE_TTL**: Default cache time-to-live in seconds (default: 300 = 5 minutes)

**Connection String Format:**
```
redis://[username]:[password]@[host]:[port]   # Non-TLS
rediss://[username]:[password]@[host]:[port]  # TLS-enabled (use this for cloud providers)
```
- `username`: Redis ACL username (typically 'default' for Redis 6+)
- `password`: Redis authentication password
- `host`: Redis server hostname
- `port`: Redis port (typically 6379 or custom port for cloud providers)

**Important:** For cloud Redis providers (cloud.redis.io, AWS ElastiCache, etc.), use `rediss://` (with double 's') in the connection string to enable TLS.

### Graceful Degradation

The Redis implementation is designed to fail gracefully. If Redis is not configured or unavailable:
- The API will continue to function normally
- All requests will bypass caching and hit the database directly
- Warnings will be logged but the service won't crash

### Connection String Benefits

Using a connection string provides:
- **Simplified Configuration**: Single secret instead of multiple environment variables
- **Better Security**: Fewer secrets to manage in your environment
- **Easy Migration**: Copy-paste connection string between environments
- **Standard Format**: Compatible with most Redis clients and tools
- **Full ACL Support**: Includes username/password for Redis 6+ authentication

## Architecture

### Core Components

1. **Redis Client** (`src/config/redis.js`)
   - Singleton Redis client with automatic reconnection
   - Connection monitoring and error handling
   - TLS support for cloud Redis providers

2. **Cache Helpers** (`src/utils/cacheHelpers.js`)
   - Cache key generation
   - Get/Set/Delete operations
   - Pattern-based cache invalidation
   - Resource-based cache management

3. **Cache Middleware** (`src/middleware/cache.js`)
   - `cacheMiddleware`: Caches GET request responses
   - `invalidateCacheMiddleware`: Invalidates cache on mutations (POST/PUT/PATCH/DELETE)

### Cache Key Structure

Cache keys follow this pattern:
```
{resource}:{path}:{params}:{queryString}
```

Examples:
- `reservations:/api/reservations/:page=1&limit=10`
- `reservations:/api/reservations/:123:`
- `table-categories:/api/table-categories/active::`

## Cached Endpoints

### Reservations (TTL: 5 minutes)
- `GET /api/reservations` - List all reservations
- `GET /api/reservations/:id` - Get specific reservation
- `GET /api/reservations/availability/check` - Check availability

### Table Categories (TTL: 10 minutes)
- `GET /api/table-categories` - List all table categories
- `GET /api/table-categories/public` - Public table categories
- `GET /api/table-categories/active` - Active table categories
- `GET /api/table-categories/stats` - Category statistics
- `GET /api/table-categories/:id` - Get specific category

## Cache Invalidation

Cache is automatically invalidated when data is modified:

### Reservations
Invalidates all `reservations:*` cache keys on:
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/confirm` - Confirm reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Table Categories
Invalidates all `table-categories:*` cache keys on:
- `POST /api/table-categories` - Create category
- `PUT /api/table-categories/:id` - Update category
- `PATCH /api/table-categories/:id/toggle-active` - Toggle active status
- `PATCH /api/table-categories/:id/sort-order` - Update sort order
- `PATCH /api/table-categories/:id/gallery` - Update gallery
- `DELETE /api/table-categories/:id` - Delete category
- `POST /api/table-categories/bulk-update` - Bulk update

## Usage Examples

### Adding Cache to a New Route

```javascript
import { cacheMiddleware, invalidateCacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Configure cache middleware
const myResourceCache = cacheMiddleware({ 
  prefix: 'my-resource',
  ttl: 300 // 5 minutes
});

const invalidateMyResourceCache = invalidateCacheMiddleware({ 
  resource: 'my-resource' 
});

// Apply to GET endpoints
router.get('/', myResourceCache, async (req, res) => {
  // Your handler
});

// Apply to mutation endpoints
router.post('/', invalidateMyResourceCache, async (req, res) => {
  // Your handler
});
```

### Manual Cache Operations

```javascript
import { 
  getCache, 
  setCache, 
  deleteCache, 
  invalidateResourceCache 
} from '../utils/cacheHelpers.js';

// Get from cache
const data = await getCache('my-key');

// Set cache with custom TTL
await setCache('my-key', { foo: 'bar' }, 600);

// Delete specific key
await deleteCache('my-key');

// Invalidate all keys for a resource
await invalidateResourceCache('reservations');
```

## Health Check

The `/api/health` endpoint now includes Redis connection status:

```json
{
  "status": "OK",
  "message": "Sundate Matcha API is running",
  "timestamp": "2025-10-16T...",
  "services": {
    "mongodb": "connected",
    "redis": "connected"
  }
}
```

## Monitoring

### Console Logs

The implementation provides detailed logging:

```
✅ Redis Connected and ready
✨ Cache hit: reservations:/api/reservations::page=1&limit=10
⏭️  Cache miss: reservations:/api/reservations/:123:
💾 Cached: reservations:/api/reservations/:123: (TTL: 300s)
🗑️  Invalidated 15 cache keys matching: reservations:*
```

### Connection Events

The Redis client monitors and logs:
- Connection established
- Ready to accept commands
- Reconnection attempts
- Errors (with graceful degradation)

## Performance Considerations

### TTL Values

- **Reservations**: 5 minutes (data changes frequently)
- **Table Categories**: 10 minutes (data changes less frequently)
- Adjust based on your traffic patterns and data freshness requirements

### Cache Hit Ratio

Monitor cache effectiveness by observing:
- Cache hit/miss logs
- Response times for cached vs uncached requests
- Redis memory usage

### Best Practices

1. **Don't cache user-specific data** unless properly keyed by user ID
2. **Use appropriate TTL values** - balance freshness vs performance
3. **Invalidate aggressively** - better to miss cache than serve stale data
4. **Monitor Redis memory** - set up eviction policies if needed
5. **Consider pagination** - large result sets are cached per page

## Troubleshooting

### Redis Connection Issues

If you see warnings about Redis:
```
⚠️  Redis not configured - caching disabled
```

**Solution**: Check your `.env` file has all required Redis variables set.

### TLS Connection Errors

If using cloud.redis.io and seeing TLS errors:
```javascript
// Ensure REDIS_TLS_ENABLED=true in .env
```

### Memory Issues

If Redis runs out of memory:
1. Increase Redis memory limit
2. Reduce TTL values
3. Implement eviction policy (LRU recommended)
4. Clear cache: `await clearAllCache()`

## Future Enhancements

Potential improvements:
- Add cache warming on server start
- Implement cache versioning for breaking changes
- Add cache analytics/metrics endpoint
- Implement Redis Pub/Sub for distributed cache invalidation
- Add cache compression for large responses
- Implement request coalescing for concurrent identical requests

## Testing

To test the caching implementation:

1. **Test Cache Hit**
   ```bash
   # First request (cache miss)
   curl http://localhost:5001/api/reservations
   
   # Second request (cache hit - should be faster)
   curl http://localhost:5001/api/reservations
   ```

2. **Test Cache Invalidation**
   ```bash
   # Create a new reservation
   curl -X POST http://localhost:5001/api/reservations -d '{...}'
   
   # Cache should be cleared - next GET will be cache miss
   curl http://localhost:5001/api/reservations
   ```

3. **Test Health Check**
   ```bash
   curl http://localhost:5001/api/health
   ```

## Support

For issues or questions about the Redis implementation, check:
- Application logs for detailed error messages
- Redis server logs if available
- Health check endpoint for connection status
- cloud.redis.io dashboard for Redis metrics

