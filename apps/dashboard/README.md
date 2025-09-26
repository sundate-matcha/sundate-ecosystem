# Sundate Admin Dashboard

A comprehensive admin dashboard for managing the Sundate Matcha restaurant operations, built with Next.js and integrated with the Sundate API.

## Features

- **Authentication**: Secure JWT-based authentication with admin role verification
- **Dashboard Overview**: Real-time statistics and activity monitoring
- **Reservation Management**: Full CRUD operations for table reservations
- **Menu Management**: Complete menu item management with categories and availability
- **User Management**: Admin user account management and role assignment
- **Contact Management**: Customer inquiry and support request handling
- **Responsive Design**: Mobile-friendly interface with modern UI components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons and Lucide React
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Sundate API server running (default: http://localhost:5001)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Setup:**
   Create a `.env.local` file in the dashboard directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3002](http://localhost:3002)

### Default Admin Credentials

- **Username**: admin
- **Email**: admin@sundate.com
- **Password**: admin123

## Usage

### Authentication

The dashboard requires admin authentication. Users must have the `admin` role to access the dashboard.

### Dashboard Overview

The main dashboard provides:
- Key statistics (reservations, menu items, users, contacts)
- Quick action buttons for common tasks
- Recent activity feed

### Reservation Management

- View all reservations with filtering options
- Confirm, cancel, or update reservation status
- Filter by date, status, and other criteria
- Edit reservation details

### Menu Management

- Add, edit, and delete menu items
- Manage categories and availability
- Toggle featured items
- Search and filter menu items

### User Management

- View all user accounts
- Update user roles (user, staff, admin)
- Filter by role and status
- View user activity and statistics

### Contact Management

- Handle customer inquiries and support requests
- Update message status and priority
- Assign messages to staff members
- Track resolution progress

## API Integration

The dashboard integrates with the Sundate API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/verify`
- **Reservations**: `/api/reservations/*`
- **Menu Items**: `/api/menu/*`
- **Users**: `/api/auth/users/*`
- **Contacts**: `/api/contact/*`

## Development

### Project Structure

```
apps/dashboard/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/          # Authentication
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   └── lib/               # Utilities and API client
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm check-types` - Run TypeScript type checking

## Security

- JWT token-based authentication
- Admin role verification for all routes
- Secure token storage in localStorage
- API request authentication headers
- Input validation and sanitization

## Contributing

1. Follow the existing code style and patterns
2. Ensure TypeScript types are properly defined
3. Test all functionality before submitting changes
4. Update documentation as needed

## License

MIT License - see LICENSE file for details
