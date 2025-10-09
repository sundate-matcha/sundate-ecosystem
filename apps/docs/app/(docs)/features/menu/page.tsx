import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Menu API - Sundate Matcha API Documentation',
  description: 'Manage menu items, categories, and dietary information'
}

// Get Menu Items
const getMenuItemsParams = [
  { name: 'category', type: 'string', description: 'Filter by category' },
  { name: 'search', type: 'string', description: 'Search in name/description' },
  { name: 'dietary', type: 'string[]', description: 'Filter by dietary restrictions' },
  { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
  { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
  { name: 'isAvailable', type: 'boolean', description: 'Filter by availability' },
  { name: 'isFeatured', type: 'boolean', description: 'Filter featured items' }
]

const getMenuItemsResponse = `{
  "menuItems": [...],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45,
  "filters": {...}
}`

// Get Categories
const getCategoriesResponse = `[
  "Breakfast",
  "Lunch", 
  "Dinner",
  "Beverages",
  "Desserts",
  "Appetizers"
]`

// Get Featured Items
const getFeaturedItemsResponse = `[
  {
    "id": "...",
    "name": "Grilled Salmon",
    "description": "...",
    "price": 28.99,
    "isFeatured": true
  }
]`

// Get Public Menu Items
const getPublicMenuItemsParams = [
  { name: 'category', type: 'string', description: 'Filter by category' },
  { name: 'search', type: 'string', description: 'Search in name/description' },
  { name: 'dietary', type: 'string[]', description: 'Filter by dietary restrictions' },
  { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
  { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
  { name: 'page', type: 'number', description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', description: 'Items per page (default: 20)' },
  { name: 'sortBy', type: 'string', description: 'Sort field (default: name)' },
  { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
]

const getPublicMenuItemsResponse = `{
  "menuItems": [
    {
      "id": "...",
      "name": "Grilled Salmon",
      "description": "...",
      "price": 28.99,
      "category": "Dinner"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45,
  "filters": {...}
}`

export default function MenuPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Menu API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Manage menu items, categories, and dietary information.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/menu"
          title="Get Menu Items"
          description="Retrieve menu items with advanced filtering, search, and pagination."
          parameters={getMenuItemsParams}
          responseExample={getMenuItemsResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/menu/categories"
          title="Get Categories"
          description="Retrieve all available menu categories."
          parameters={[]}
          responseExample={getCategoriesResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/menu/featured"
          title="Get Featured Items"
          description="Retrieve all featured menu items."
          parameters={[]}
          responseExample={getFeaturedItemsResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/menu/public"
          title="Get Public Menu Items"
          description="Retrieve public menu items for landing page (only available items)."
          parameters={getPublicMenuItemsParams}
          responseExample={getPublicMenuItemsResponse}
        />
      </div>
    </div>
  )
}
