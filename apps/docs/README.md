# SunDate Café API Documentation

A comprehensive, interactive documentation site for the SunDate Café Restaurant Management System API.

## Features

- **Interactive API Documentation**: Detailed endpoint documentation with examples
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Comprehensive Coverage**: Covers all API endpoints (Reservations, Menu, Contact)
- **Code Examples**: Request/response examples for each endpoint
- **Authentication Guide**: Complete authentication documentation
- **Error Handling**: Detailed error codes and response formats
- **Mobile Responsive**: Works perfectly on all device sizes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React for beautiful, consistent icons
- **TypeScript**: Full type safety and IntelliSense support
- **Monorepo**: Part of the SunDate ecosystem

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sundate-cafe/sundate-ecosystem.git
cd sundate-ecosystem
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
cd apps/docs
pnpm dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
apps/docs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main documentation page
│   └── globals.css        # Global styles and Tailwind imports
├── lib/                    # Utility functions
│   └── utils.ts           # Class name utilities
├── public/                 # Static assets
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints Documented

### Reservations API
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/availability/check` - Check availability
- `PUT /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/confirm` - Confirm reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Menu API
- `GET /api/menu` - Get menu items with filtering
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/search` - Search menu items
- `GET /api/menu/dietary/:dietary` - Get items by dietary restrictions
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Contact API
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `GET /api/contact/stats` - Get contact statistics (admin)
- `GET /api/contact/urgent` - Get urgent contacts (admin)
- `GET /api/contact/:id` - Get specific contact (admin)
- `PUT /api/contact/:id` - Update contact (admin)
- `DELETE /api/contact/:id` - Delete contact (admin)

## Customization

### Adding New Endpoints

1. Update the main page component (`app/page.tsx`)
2. Add new endpoint cards using the `EndpointCard` component
3. Include proper method, path, description, parameters, and response examples

### Styling

- Modify `app/globals.css` for custom CSS
- Update `tailwind.config.js` for theme customization
- Use the existing design system classes for consistency

### Content

- All content is in the main page component
- Easy to modify text, examples, and documentation
- Structured for maintainability and readability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the SunDate Café ecosystem and is proprietary software.

## Support

For questions or support:
- Email: dev@sundate-cafe.com
- Documentation: https://docs.sundate-cafe.com
- Support: https://support.sundate-cafe.com

---

Built with ❤️ by the SunDate Café Development Team
