#!/bin/bash

# Docker-based notification testing setup
# This script sets up a complete testing environment for notifications

echo "🐳 Setting up Docker-based notification testing environment..."

# Create docker-compose for testing
cat > docker-compose.test.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: sundate-mongodb-test
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: sundate-matcha-test
    volumes:
      - mongodb_test_data:/data/db

  redis:
    image: redis:7.2-alpine
    container_name: sundate-redis-test
    ports:
      - "6379:6379"

  api:
    build: .
    container_name: sundate-api-test
    ports:
      - "5001:5001"
    environment:
      NODE_ENV: test
      MONGODB_URI: mongodb://mongodb:27017/sundate-matcha-test
      REDIS_URL: redis://redis:6379
      ENABLE_PUSH_NOTIFICATIONS: true
      LOG_RETENTION_DAYS: 7
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./src:/app/src
      - ./scripts:/app/scripts
    command: npm run dev

  notification-tester:
    build: .
    container_name: sundate-notification-tester
    environment:
      NODE_ENV: test
      MONGODB_URI: mongodb://mongodb:27017/sundate-matcha-test
      API_BASE_URL: http://api:5001/api
    depends_on:
      - api
    volumes:
      - ./scripts:/app/scripts
    command: node scripts/test-mobile-notifications.js

volumes:
  mongodb_test_data:
EOF

# Create test environment file
cat > .env.test << 'EOF'
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/sundate-matcha-test
REDIS_URL=redis://localhost:6379
ENABLE_PUSH_NOTIFICATIONS=true
LOG_RETENTION_DAYS=7
PORT=5001
EOF

# Create test runner script
cat > scripts/run-tests.sh << 'EOF'
#!/bin/bash

echo "🧪 Running notification tests..."

# Start services
echo "Starting test services..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run tests
echo "Running notification tests..."
docker-compose -f docker-compose.test.yml run --rm notification-tester

# Show logs
echo "Showing API logs..."
docker-compose -f docker-compose.test.yml logs api

# Cleanup
echo "Cleaning up..."
docker-compose -f docker-compose.test.yml down -v

echo "✅ Tests completed!"
EOF

chmod +x scripts/run-tests.sh

echo "✅ Docker test environment created!"
echo ""
echo "To run tests:"
echo "  ./scripts/run-tests.sh"
echo ""
echo "To start services manually:"
echo "  docker-compose -f docker-compose.test.yml up -d"
echo ""
echo "To stop services:"
echo "  docker-compose -f docker-compose.test.yml down -v"
