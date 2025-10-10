import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Table Categories API - Sundate Matcha API Documentation',
  description: 'Manage table categories with different capacities, pricing, and availability options'
}

// Common category response structure
const tableCategoryExample = `{
  "_id": "...",
  "name": "VIP Table",
  "description": "Premium table with ocean view",
  "capacity": 6,
  "price": 50.00,
  "sortOrder": 1,
  "isActive": true,
  "thumbnail": "https://example.com/thumb.jpg",
  "gallery": ["https://example.com/img1.jpg"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}`

// Get All Table Categories
const getAllTableCategoriesParams = [
  { name: 'isActive', type: 'boolean', description: 'Filter by active status' },
  { name: 'search', type: 'string', description: 'Search in name and description' },
  { name: 'minCapacity', type: 'number', description: 'Minimum capacity filter' },
  { name: 'maxCapacity', type: 'number', description: 'Maximum capacity filter' },
  { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
  { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
  { name: 'page', type: 'number', description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', description: 'Items per page (default: 20)' },
  { name: 'sortBy', type: 'string', description: 'Sort field (default: sortOrder)' },
  { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
]

const getAllTableCategoriesResponse = `{
  "tableCategories": [
    ${tableCategoryExample}
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45,
  "filters": {...}
}`

// Get Public Table Categories
const getPublicTableCategoriesParams = [
  { name: 'search', type: 'string', description: 'Search in name and description' },
  { name: 'minCapacity', type: 'number', description: 'Minimum capacity filter' },
  { name: 'maxCapacity', type: 'number', description: 'Maximum capacity filter' },
  { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
  { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
  { name: 'page', type: 'number', description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', description: 'Items per page (default: 20)' },
  { name: 'sortBy', type: 'string', description: 'Sort field (default: sortOrder)' },
  { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
]

const getPublicTableCategoriesResponse = `{
  "tableCategories": [
    {
      "_id": "...",
      "name": "VIP Table",
      "description": "Premium table with ocean view",
      "capacity": 6,
      "price": 50.00,
      "sortOrder": 1,
      "thumbnail": "https://example.com/thumb.jpg",
      "gallery": ["https://example.com/img1.jpg"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45
}`

// Get Active Table Categories
const getActiveTableCategoriesResponse = `[
  {
    "_id": "...",
    "name": "VIP Table",
    "capacity": 6,
    "price": 50.00,
    "sortOrder": 1
  },
  {
    "_id": "...",
    "name": "Standard Table",
    "capacity": 4,
    "price": 0.00,
    "sortOrder": 2
  }
]`

// Get Table Category Statistics
const getTableCategoryStatsResponse = `{
  "totalCategories": 12,
  "activeCategories": 10,
  "inactiveCategories": 2,
  "capacityStats": {
    "avgCapacity": 4.5,
    "minCapacity": 2,
    "maxCapacity": 8
  },
  "priceStats": {
    "avgPrice": 25.00,
    "minPrice": 0.00,
    "maxPrice": 100.00
  },
  "categoriesWithGallery": 8
}`

// Get Table Category by ID
const getTableCategoryByIdParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' }
]

const getTableCategoryByIdResponse = tableCategoryExample

// Create Table Category
const createTableCategoryParams = [
  { name: 'name', type: 'string', required: true, description: 'Category name (2-100 chars)' },
  { name: 'description', type: 'string', required: false, description: 'Description (max 500 chars)' },
  { name: 'thumbnail', type: 'string', required: false, description: 'Thumbnail URL (max 200 chars)' },
  { name: 'gallery', type: 'array', required: false, description: 'Array of image URLs' },
  { name: 'price', type: 'number', required: false, description: 'Price (min: 0, default: 0)' },
  { name: 'capacity', type: 'number', required: true, description: 'Table capacity (min: 1)' },
  { name: 'sortOrder', type: 'number', required: true, description: 'Sort order (min: 0)' },
  { name: 'isActive', type: 'boolean', required: false, description: 'Active status (default: true)' }
]

const createTableCategoryResponse = `{
  "message": "Table category created successfully",
  "tableCategory": ${tableCategoryExample}
}`

// Update Table Category
const updateTableCategoryParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' },
  { name: 'name', type: 'string', required: false, description: 'Category name (2-100 chars)' },
  { name: 'description', type: 'string', required: false, description: 'Description (max 500 chars)' },
  { name: 'thumbnail', type: 'string', required: false, description: 'Thumbnail URL (max 200 chars)' },
  { name: 'gallery', type: 'array', required: false, description: 'Array of image URLs' },
  { name: 'price', type: 'number', required: false, description: 'Price (min: 0)' },
  { name: 'capacity', type: 'number', required: false, description: 'Table capacity (min: 1)' },
  { name: 'sortOrder', type: 'number', required: false, description: 'Sort order (min: 0)' },
  { name: 'isActive', type: 'boolean', required: false, description: 'Active status' }
]

const updateTableCategoryResponse = `{
  "message": "Table category updated successfully",
  "tableCategory": {
    "_id": "...",
    "name": "Updated VIP Table",
    "description": "Updated description",
    "capacity": 8,
    "price": 75.00,
    "sortOrder": 1,
    "isActive": true,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}`

// Toggle Active Status
const toggleActiveStatusParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' }
]

const toggleActiveStatusResponse = `{
  "message": "Table category activated",
  "tableCategory": {
    "_id": "...",
    "name": "VIP Table",
    "isActive": true,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}`

// Update Sort Order
const updateSortOrderParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' },
  { name: 'sortOrder', type: 'number', required: true, description: 'New sort order (min: 0)' }
]

const updateSortOrderResponse = `{
  "message": "Sort order updated successfully",
  "tableCategory": {
    "_id": "...",
    "name": "VIP Table",
    "sortOrder": 2,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}`

// Update Gallery
const updateGalleryParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' },
  { name: 'gallery', type: 'array', required: true, description: 'Array of image URLs' }
]

const updateGalleryResponse = `{
  "message": "Gallery updated successfully",
  "tableCategory": {
    "_id": "...",
    "name": "VIP Table",
    "gallery": [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg",
      "https://example.com/img3.jpg"
    ],
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}`

// Delete Table Category
const deleteTableCategoryParams = [
  { name: 'id', type: 'string', required: true, description: 'Table category ID' }
]

const deleteTableCategoryResponse = `{
  "message": "Table category deleted successfully"
}`

// Bulk Update Table Categories
const bulkUpdateTableCategoriesParams = [
  { name: 'updates', type: 'array', required: true, description: 'Array of update objects with id and update data' }
]

const bulkUpdateTableCategoriesResponse = `{
  "message": "Bulk update completed",
  "results": [
    {
      "id": "...",
      "success": true,
      "tableCategory": {...}
    },
    {
      "id": "...",
      "error": "Table category not found"
    }
  ]
}`

export default function TableCategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Table Categories API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Manage table categories with different capacities, pricing, and availability options.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/table-categories"
          title="Get All Table Categories"
          description="Retrieve a paginated list of all table categories with filtering and sorting options."
          parameters={getAllTableCategoriesParams}
          responseExample={getAllTableCategoriesResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/table-categories/public"
          title="Get Public Table Categories"
          description="Retrieve public table categories for customer-facing applications (active only)."
          parameters={getPublicTableCategoriesParams}
          responseExample={getPublicTableCategoriesResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/table-categories/active"
          title="Get Active Table Categories"
          description="Retrieve a simple list of all active table categories."
          parameters={[]}
          responseExample={getActiveTableCategoriesResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/table-categories/stats"
          title="Get Table Category Statistics"
          description="Retrieve statistics and analytics for table categories (staff/admin only)."
          parameters={[]}
          responseExample={getTableCategoryStatsResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/table-categories/:id"
          title="Get Table Category by ID"
          description="Retrieve a specific table category by its ID."
          parameters={getTableCategoryByIdParams}
          responseExample={getTableCategoryByIdResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/table-categories"
          title="Create Table Category"
          description="Create a new table category (admin only)."
          parameters={createTableCategoryParams}
          responseExample={createTableCategoryResponse}
        />

        <EndpointCard
          method="PUT"
          path="/api/table-categories/:id"
          title="Update Table Category"
          description="Update an existing table category (admin only)."
          parameters={updateTableCategoryParams}
          responseExample={updateTableCategoryResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/table-categories/:id/toggle-active"
          title="Toggle Active Status"
          description="Toggle the active status of a table category (admin only)."
          parameters={toggleActiveStatusParams}
          responseExample={toggleActiveStatusResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/table-categories/:id/sort-order"
          title="Update Sort Order"
          description="Update the sort order of a table category (admin only)."
          parameters={updateSortOrderParams}
          responseExample={updateSortOrderResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/table-categories/:id/gallery"
          title="Update Gallery"
          description="Update the gallery images of a table category (admin only)."
          parameters={updateGalleryParams}
          responseExample={updateGalleryResponse}
        />

        <EndpointCard
          method="DELETE"
          path="/api/table-categories/:id"
          title="Delete Table Category"
          description="Delete a table category (admin only)."
          parameters={deleteTableCategoryParams}
          responseExample={deleteTableCategoryResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/table-categories/bulk-update"
          title="Bulk Update Table Categories"
          description="Update multiple table categories at once (admin only)."
          parameters={bulkUpdateTableCategoriesParams}
          responseExample={bulkUpdateTableCategoriesResponse}
        />
      </div>
    </div>
  )
}
