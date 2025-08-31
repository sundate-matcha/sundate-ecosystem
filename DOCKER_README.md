# Docker Setup for Sundate Ecosystem

This project includes Docker configurations for all sub-apps (excluding mobile) and Docker Compose files for easy orchestration.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of available RAM

## Project Structure

```
sundate-ecosystem/
├── apps/
│   ├── api/          # Backend API (Node.js/Express)
│   ├── docs/         # Documentation Site (Next.js)
│   └── mobile/       # Mobile App (React Native - not containerized)
├── nginx/             # Nginx configuration
├── scripts/           # Test and utility scripts
├── docker-compose.yml # Production setup
└── DOCKER_README.md  # This file
```

## Quick Start

### Development Environment

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **View logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Production Environment

1. **Add domain to hosts file (for local testing):**
   ```bash
   # Add this line to your hosts file:
   # Windows: C:\Windows\System32\drivers\etc\hosts
   # Linux/Mac: /etc/hosts
   127.0.0.1 sundate.justdemo.work
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Access your applications:**
   - **Docs (Root):** http://sundate.justdemo.work:88
   - **API:** http://sundate.justdemo.work:88/api
   - **Health Check:** http://sundate.justdemo.work:88/health

6. **Test Setup:**
   ```bash
   # Windows PowerShell
   .\scripts\test-docker.ps1
   
   # Linux/Mac
   ./scripts/test-docker.sh
   ```

## Services

### MongoDB Database
- **Port:** 27017
- **Username:** admin
- **Password:** password123
- **Database:** sundate

### API Backend
- **Port:** 5001 (internal)
- **Health Check:** http://localhost:5001/api/health
- **Dependencies:** MongoDB
- **External Access:** http://sundate.justdemo.work:88/api

### Documentation Site
- **Port:** 3001 (internal)
- **Health Check:** http://localhost:3001/api/health
- **Dependencies:** None
- **External Access:** http://sundate.justdemo.work:88

### Nginx Reverse Proxy
- **Port:** 88 (external), 80 (internal)
- **Health Check:** http://localhost/health
- **Dependencies:** Documentation Site, API Backend
- **Domain:** sundate.justdemo.work

## Individual App Building

### Build API Image
```bash
cd apps/api
docker build -t sundate-api .
docker run -p 5001:5001 sundate-api
```



### Build Docs Image
```bash
cd apps/docs
docker build -t sundate-docs .
docker run -p 3001:3001 sundate-docs
```

## Environment Variables

### API Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5001)
- `MONGO_URI`: MongoDB connection string



### Documentation Site
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)

## Development vs Production

### Development (`docker-compose.dev.yml`)
- Volume mounts for hot reloading
- Development environment variables
- Source code changes reflect immediately
- Separate network and volume names

### Production (`docker-compose.yml`)
- Optimized builds
- Production environment variables
- Includes Nginx reverse proxy
- Persistent MongoDB data

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure port 88 is available
   - Stop other services using port 88

2. **MongoDB connection issues:**
   - Wait for MongoDB to be healthy before starting API
   - Check MongoDB logs: `docker-compose logs mongodb`

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Ensure all dependencies are properly installed

4. **Memory issues:**
   - Increase Docker Desktop memory allocation
   - Stop unnecessary containers

### Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container-name>

# Execute commands in running container
docker exec -it <container-name> /bin/sh

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## Customization

### Adding New Services
1. Create a Dockerfile in the app directory
2. Add service configuration to docker-compose files
3. Update network dependencies if needed

### Modifying Ports
Update the `ports` section in the appropriate docker-compose file:
```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Environment Variables
Add or modify environment variables in the `environment` section:
```yaml
environment:
  - CUSTOM_VAR=value
```

## Security Notes

- Default MongoDB credentials are for development only
- Change passwords in production
- Consider using Docker secrets for sensitive data
- Restrict network access in production environments

## Performance Optimization

- Use multi-stage builds for smaller images
- Implement proper health checks
- Use volume mounts for development
- Consider using Docker layer caching
