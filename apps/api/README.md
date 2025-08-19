# SunDate Café API

A comprehensive Express.js backend API for the SunDate Café website, featuring table reservations, menu management, and contact form handling.

## Features

- **Table Reservations**: Full CRUD operations for table bookings with availability checking
- **Menu Management**: Comprehensive menu item management with categories, dietary options, and search
- **Contact System**: Contact form handling with priority management and staff assignment
- **MongoDB Integration**: Robust data models with validation and business logic
- **RESTful API**: Clean, well-documented REST endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet.js security headers, CORS configuration, and rate limiting

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **Security**: Helmet.js, CORS, rate limiting
- **Logging**: Morgan HTTP request logger

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- pnpm package manager

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sundate-cafe
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

3. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

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

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create new menu item
- `GET /api/menu/:id` - Get specific menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/search` - Search menu items
- `GET /api/menu/dietary/:dietary` - Get items by dietary restrictions

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
- `GET /api/health` - API health status

## Data Models

### Reservation
- Customer information (name, email, phone)
- Reservation details (date, time, guests)
- Special requests and status tracking
- Business logic for availability checking

### MenuItem
- Item details (name, description, price, category)
- Dietary information (allergens, dietary options)
- Nutritional information (calories, protein, carbs, fat)
- Availability and featured status

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

### Menu Management
- Category-based organization
- Dietary restriction filtering
- Search functionality
- Featured item highlighting

### Contact Management
- Priority-based routing
- Staff assignment system
- Response tracking
- Statistical reporting

## Security Features

- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Configuration**: Secure cross-origin resource sharing
- **Security Headers**: Helmet.js for security best practices
- **Data Sanitization**: Input cleaning and normalization

## Future Enhancements

- **Authentication**: JWT-based user authentication
- **Email Integration**: Automated email notifications
- **File Uploads**: Image management for menu items
- **Analytics**: Advanced reporting and analytics
- **Real-time Updates**: WebSocket integration for live updates
- **Payment Integration**: Online payment processing
- **Admin Dashboard**: Web-based administration interface

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
