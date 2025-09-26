'use client';

import { useEffect, useState } from 'react';
import { apiClient, MenuItem } from '@/lib/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts', 'Appetizers'];

  useEffect(() => {
    fetchMenuItems();
  }, [categoryFilter, searchTerm]);

  const fetchMenuItems = async () => {
    try {
      const params: any = { limit: 100 };
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await apiClient.getMenuItems(params);
      if (response.data) {
        setMenuItems(response.data.menuItems);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        await apiClient.deleteMenuItem(id);
        fetchMenuItems();
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await apiClient.updateMenuItem(id, { isAvailable: !isAvailable });
      fetchMenuItems();
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await apiClient.updateMenuItem(id, { isFeatured: !isFeatured });
      fetchMenuItems();
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant menu items and categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu items..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{item.emoji || '🍽️'}</span>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    {item.isFeatured && (
                      <StarIcon className="h-5 w-5 text-yellow-400 ml-2" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {item.dietary.map((diet) => (
                          <span
                            key={diet}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {diet}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                      item.isAvailable
                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                    }`}
                  >
                    {item.isAvailable ? (
                      <EyeSlashIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <EyeIcon className="h-4 w-4 mr-1" />
                    )}
                    {item.isAvailable ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(item._id, item.isFeatured)}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                      item.isFeatured
                        ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <StarIcon className="h-4 w-4 mr-1" />
                    {item.isFeatured ? 'Featured' : 'Feature'}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
          <p className="mt-1 text-sm text-gray-500">
            No menu items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
