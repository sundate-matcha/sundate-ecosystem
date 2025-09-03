const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'staff';
  isActive: boolean;
  lastLogin?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  name: string;
  email?: string;
  phone: string;
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

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Beverages' | 'Desserts' | 'Appetizers';
  image?: string;
  emoji?: string;
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
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Authentication
  async login(identifier: string, password: string) {
    return this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user?: User }>('/api/auth/verify', {
      method: 'GET',
    });
  }

  // Users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<{
      users: User[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/api/auth/users${query ? `?${query}` : ''}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<User>(`/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Reservations
  async getReservations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<{
      reservations: Reservation[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/api/reservations${query ? `?${query}` : ''}`);
  }

  async getReservation(id: string) {
    return this.request<Reservation>(`/api/reservations/${id}`);
  }

  async updateReservation(id: string, data: Partial<Reservation>) {
    return this.request<Reservation>(`/api/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async confirmReservation(id: string) {
    return this.request<Reservation>(`/api/reservations/${id}/confirm`, {
      method: 'PATCH',
    });
  }

  async cancelReservation(id: string) {
    return this.request<Reservation>(`/api/reservations/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteReservation(id: string) {
    return this.request(`/api/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Menu Items
  async getMenuItems(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<{
      menuItems: MenuItem[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/api/menu${query ? `?${query}` : ''}`);
  }

  async getMenuItem(id: string) {
    return this.request<MenuItem>(`/api/menu/${id}`);
  }

  async createMenuItem(data: Partial<MenuItem>) {
    return this.request<MenuItem>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>) {
    return this.request<MenuItem>(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string) {
    return this.request(`/api/menu/${id}`, {
      method: 'DELETE',
    });
  }

  async getMenuCategories() {
    return this.request<string[]>('/api/menu/categories');
  }

  // Contact
  async getContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<{
      contacts: Contact[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/api/contact${query ? `?${query}` : ''}`);
  }

  async getContact(id: string) {
    return this.request<Contact>(`/api/contact/${id}`);
  }

  async updateContact(id: string, data: Partial<Contact>) {
    return this.request<Contact>(`/api/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async assignContact(id: string, assignedTo: string) {
    return this.request<Contact>(`/api/contact/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
  }

  async resolveContact(id: string) {
    return this.request<Contact>(`/api/contact/${id}/resolve`, {
      method: 'PATCH',
    });
  }

  async deleteContact(id: string) {
    return this.request(`/api/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async getContactStats() {
    return this.request<{
      total: number;
      new: number;
      inProgress: number;
      resolved: number;
      urgent: number;
    }>('/api/contact/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
