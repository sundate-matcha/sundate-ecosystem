import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Admin Menu Management - Sundate Matcha API Documentation',
  description: 'Administrative endpoints for managing menu items. Requires admin authentication'
}

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Admin Menu Management</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Administrative endpoints for managing menu items. Requires admin authentication.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/menu"
          title="Create Menu Item"
          description="Create a new menu item. Admin only."
          parameters={[
            { name: 'name', type: 'string', required: true, description: 'Item name (2-100 chars)' },
            { name: 'description', type: 'string', required: true, description: 'Description (10-500 chars)' },
            { name: 'price', type: 'number', required: true, description: 'Price (positive number)' },
            { name: 'category', type: 'string', required: true, description: 'Category from predefined list' },
            { name: 'ingredients', type: 'string[]', required: false, description: 'Array of ingredients' },
            { name: 'allergens', type: 'string[]', required: false, description: 'Array of allergens' },
            { name: 'dietary', type: 'string[]', required: false, description: 'Dietary options' },
            { name: 'preparationTime', type: 'number', required: false, description: 'Prep time in minutes' },
            { name: 'calories', type: 'number', required: false, description: 'Calorie content' },
            { name: 'protein', type: 'number', required: false, description: 'Protein content' },
            { name: 'carbs', type: 'number', required: false, description: 'Carbohydrate content' },
            { name: 'fat', type: 'number', required: false, description: 'Fat content' },
            { name: 'tags', type: 'string[]', required: false, description: 'Array of tags' }
          ]}
          responseExample={`{
  "message": "Menu item created successfully",
  "menuItem": {
    "id": "...",
    "name": "Grilled Salmon",
    "description": "...",
    "price": 28.99,
    "category": "Dinner"
  }
}`}
        />

        <EndpointCard
          method="PUT"
          path="/api/menu/:id"
          title="Update Menu Item"
          description="Update an existing menu item. Admin only."
          parameters={[
            { name: 'id', type: 'string', required: true, description: 'Menu item ID' },
            { name: 'name', type: 'string', required: false, description: 'Item name (2-100 chars)' },
            { name: 'description', type: 'string', required: false, description: 'Description (10-500 chars)' },
            { name: 'price', type: 'number', required: false, description: 'Price (positive number)' },
            { name: 'category', type: 'string', required: false, description: 'Category from predefined list' }
          ]}
          responseExample={`{
  "message": "Menu item updated successfully",
  "menuItem": {
    "id": "...",
    "name": "Updated Grilled Salmon",
    "description": "...",
    "price": 29.99,
    "category": "Dinner"
  }
}`}
        />

        <EndpointCard
          method="DELETE"
          path="/api/menu/:id"
          title="Delete Menu Item"
          description="Delete a menu item. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item deleted successfully"
}`}
        />

        <EndpointCard
          method="PATCH"
          path="/api/menu/:id/toggle-availability"
          title="Toggle Availability"
          description="Toggle menu item availability. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item made unavailable",
  "menuItem": {
    "id": "...",
    "isAvailable": false
  }
}`}
        />

        <EndpointCard
          method="PATCH"
          path="/api/menu/:id/toggle-featured"
          title="Toggle Featured Status"
          description="Toggle menu item featured status. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item marked as featured",
  "menuItem": {
    "id": "...",
    "isFeatured": true
  }
}`}
        />
      </div>
    </div>
  )
}

