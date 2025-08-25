// API service for Sundate Matcha frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Types
export interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  tableNumber?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  name: string;
  email?: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  notes?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Beverages' | 'Desserts' | 'Appetizers';
  image?: string;
  emoji: string;
  ingredients?: string[];
  allergens?: string[];
  dietary?: string[];
  spicyLevel: number;
  preparationTime: number;
  isAvailable: boolean;
  isFeatured: boolean;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
  tags?: string[];
  source: string;
  isNewsletterSignup: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
  source?: string;
  isNewsletterSignup?: boolean;
}

export interface AvailabilityCheck {
  date: string;
  time: string;
  guests: number;
  available: boolean;
  currentOccupancy: number;
  remainingCapacity: number;
}

// Reservation API
export const reservationAPI = {
  // Create a new reservation
  async create(data: CreateReservationRequest): Promise<{ message: string; reservation: Reservation; confirmationNumber: string }> {
    return apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Check availability
  async checkAvailability(date: string, time: string, guests: number): Promise<AvailabilityCheck> {
    return apiRequest(`/reservations/availability/check?date=${date}&time=${time}&guests=${guests}`);
  },

  // Get reservation by ID
  async getById(id: string): Promise<Reservation> {
    return apiRequest(`/reservations/${id}`);
  },

  // Update reservation
  async update(id: string, data: Partial<CreateReservationRequest>): Promise<{ message: string; reservation: Reservation }> {
    return apiRequest(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Cancel reservation
  async cancel(id: string): Promise<{ message: string; reservation: Reservation }> {
    return apiRequest(`/reservations/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Confirm reservation
  async confirm(id: string): Promise<{ message: string; reservation: Reservation }> {
    return apiRequest(`/reservations/${id}/confirm`, {
      method: 'PATCH',
    });
  },
};

// Menu API
export const menuAPI = {
  // Get all menu items
  async getAll(params?: {
    category?: string;
    search?: string;
    dietary?: string[];
    maxPrice?: number;
    minPrice?: number;
    spicyLevel?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    menuItems: MenuItem[];
    totalPages: number;
    currentPage: number;
    total: number;
    filters: {
      category?: string;
      search?: string;
      dietary?: string[];
      maxPrice?: number;
      minPrice?: number;
      spicyLevel?: number;
      isAvailable?: boolean;
      isFeatured?: boolean;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/menu${queryString ? `?${queryString}` : ''}`);
  },

  // Get menu items by category
  async getByCategory(category: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    category: string;
    menuItems: MenuItem[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/menu/category/${category}${queryString ? `?${queryString}` : ''}`);
  },

  // Get featured menu items
  async getFeatured(): Promise<MenuItem[]> {
    return apiRequest('/menu/featured');
  },

  // Search menu items
  async search(query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    query: string;
    menuItems: MenuItem[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    const searchParams = new URLSearchParams({ q: query });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return apiRequest(`/menu/search?${searchParams.toString()}`);
  },

  // Get menu item by ID
  async getById(id: string): Promise<MenuItem> {
    return apiRequest(`/menu/${id}`);
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    return apiRequest('/menu/categories');
  },

  // Get menu items by dietary restrictions
  async getByDietary(dietary: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    dietary: string;
    menuItems: MenuItem[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/menu/dietary/${dietary}${queryString ? `?${queryString}` : ''}`);
  },
};

// Contact API
export const contactAPI = {
  // Submit contact form
  async submit(data: CreateContactRequest): Promise<{ message: string; contact: Contact; referenceNumber: string }> {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get contact by ID
  async getById(id: string): Promise<Contact> {
    return apiRequest(`/contact/${id}`);
  },
};

// Health check
export const healthAPI = {
  async check(): Promise<{ status: string; message: string; timestamp: string }> {
    return apiRequest('/health');
  },
};

// Utility functions
export const apiUtils = {
  // Format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Format date
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Format time
  formatTime(time: string): string {
    return time;
  },

  // Get spicy level description
  getSpicyLevelDescription(level: number): string {
    const levels = ['Not Spicy', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme'];
    return levels[level] || 'Not Spicy';
  },

  // Check if API is available
  async isAvailable(): Promise<boolean> {
    try {
      await healthAPI.check();
      return true;
    } catch {
      return false;
    }
  },
};

export default {
  reservation: reservationAPI,
  menu: menuAPI,
  contact: contactAPI,
  health: healthAPI,
  utils: apiUtils,
};
