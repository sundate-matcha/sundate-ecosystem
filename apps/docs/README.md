# Sundate Matcha API Documentation

This is the interactive documentation for the Sundate Matcha API, built with Next.js and featuring a comprehensive testing interface.

## Features

- **Interactive API Documentation**: Complete endpoint documentation with examples
- **API Testing Interface**: Test endpoints directly from the documentation
- **Real-time Response Display**: See API responses in real-time
- **Parameter Forms**: Dynamic forms for different endpoint types
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm package manager
- Sundate Matcha API server running

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## API Testing

The documentation includes an interactive API testing section that allows you to:

- **Configure API Base URL**: Set the URL where your API server is running
- **Select Endpoints**: Choose from available API endpoints
- **Input Parameters**: Fill out forms for query parameters and request bodies
- **Execute Requests**: Send requests and see responses in real-time
- **View Responses**: See formatted JSON responses and error messages

### Supported Endpoints

- **Reservations**: GET all, POST create, GET availability check
- **Menu**: GET items, GET categories, filtering and search
- **Contact**: POST submit form
- **Health**: GET status check

### Testing Setup

1. **Start your API server** (default: http://localhost:5001)
2. **Navigate to the "API Testing" section** in the documentation
3. **Update the API Base URL** if your server runs on a different port
4. **Select an endpoint** from the dropdown
5. **Fill out the required parameters** (if any)
6. **Click "Execute Request"** to test the endpoint

## Development

### Project Structure

```
apps/docs/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main documentation page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── lib/                 # Utility functions
└── package.json         # Dependencies
```

### Adding New Endpoints

To add new endpoints to the testing interface:

1. **Update the `endpoints` array** in `page.tsx`
2. **Add parameter forms** for the new endpoint
3. **Handle the response** in the `handleApiCall` function

### Styling

The documentation uses Tailwind CSS with custom components:
- Method badges (GET, POST, PUT, DELETE)
- Form inputs and buttons
- Response display areas
- Dark mode support

## API Server Requirements

Make sure your API server supports:

- **CORS**: Allow requests from the documentation origin
- **JSON**: Accept and return JSON data
- **Validation**: Proper input validation and error responses
- **Health Check**: `/api/health` endpoint for status checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the documentation locally
5. Submit a pull request

## License

MIT License - see LICENSE file for details
