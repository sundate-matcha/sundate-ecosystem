# Sundate Matcha API

A comprehensive Express.js backend API for the Sundate Matcha website, featuring table reservations, contact form handling, and notification management.

## Features

- **Table Reservations**: Full CRUD operations for table bookings with availability checking
- **Contact System**: Contact form handling with priority management and staff assignment
- **Notification Management**: Push notifications and in-app notification system
- **User Authentication**: Secure user registration, login, and profile management
- **Redis Caching**: High-performance caching layer for GET endpoints with automatic cache invalidation
- **MongoDB Integration**: Robust data models with validation and business logic
- **RESTful API**: Clean, well-documented REST endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet.js security headers, CORS configuration, and rate limiting

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis with ioredis client
- **Validation**: express-validator
- **Security**: Helmet.js, CORS, rate limiting
- **Logging**: Morgan HTTP request logger, Winston

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- Redis instance (optional, for caching - cloud.redis.io recommended)
- pnpm package manager

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory. See `env.example` for all available options:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/sundate
   CLIENT_ORIGIN=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Redis Configuration (optional)
   REDIS_URL=redis://username:password@host:port
   REDIS_TLS_ENABLED=true
   REDIS_CACHE_TTL=300
   ```

3. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

4. **Redis Setup (Optional but Recommended):**
   - For local development: Install and run Redis locally
   - For production: Use cloud.redis.io or similar managed Redis service
   - See `REDIS_CACHE_IMPLEMENTATION.md` for detailed setup instructions
   - The API will work without Redis, but with reduced performance

## Usage

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm start
```

### Build
```bash
pnpm build
```

## API Endpoints

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/:id` - Get specific reservation
- `PUT /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/confirm` - Confirm reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `DELETE /api/reservations/:id` - Delete reservation
- `GET /api/reservations/availability/check` - Check availability

### Contact
- `GET /api/contact` - Get all contact submissions
- `POST /api/contact` - Submit contact form
- `GET /api/contact/:id` - Get specific contact
- `PUT /api/contact/:id` - Update contact
- `PATCH /api/contact/:id/assign` - Assign to staff member
- `PATCH /api/contact/:id/resolve` - Mark as resolved
- `PATCH /api/contact/:id/status` - Update status
- `DELETE /api/contact/:id` - Delete contact
- `GET /api/contact/urgent` - Get urgent contacts
- `GET /api/contact/stats` - Get contact statistics

### Health Check
- `GET /api/health` - API health status (includes MongoDB and Redis connection status)

## Data Models

### Reservation
- Customer information (name, email, phone)
- Reservation details (date, time, guests)
- Special requests and status tracking
- Business logic for availability checking

### Contact
- Contact information (name, email, phone, subject, message)
- Category and priority classification
- Status tracking and staff assignment
- Response management

## Business Logic

### Reservation System
- Automatic availability checking
- Duplicate reservation prevention
- Business hours validation
- Capacity management

### Contact Management
- Priority-based routing
- Staff assignment system
- Response tracking
- Statistical reporting

## Performance & Security Features

### Performance
- **Redis Caching**: Automatic caching of GET endpoints with configurable TTL
- **Cache Invalidation**: Smart cache invalidation on data mutations
- **Optimized Queries**: Efficient MongoDB queries with proper indexing

### Security
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Configuration**: Secure cross-origin resource sharing
- **Security Headers**: Helmet.js for security best practices
- **Data Sanitization**: Input cleaning and normalization
- **TLS Support**: Secure Redis connections with TLS

## Documentation

- **Redis Caching**: See `REDIS_CACHE_IMPLEMENTATION.md` for complete caching documentation
- **Notifications**: See `notes/NOTIFICATIONS_AND_LOGGING.md` for notification system details
- **API Testing**: Check the docs app for interactive API documentation

## Future Enhancements

- **Cache Analytics**: Metrics and monitoring dashboard for cache performance
- **Email Integration**: Automated email notifications
- **Advanced Analytics**: Business intelligence and reporting
- **Real-time Updates**: WebSocket integration for live updates
- **Payment Integration**: Online payment processing
- **Admin Dashboard**: Enhanced web-based administration interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
