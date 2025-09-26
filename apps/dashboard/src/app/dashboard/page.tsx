'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  menuItems: {
    total: number;
    available: number;
    featured: number;
  };
  users: {
    total: number;
    active: number;
    admins: number;
  };
  contacts: {
    total: number;
    new: number;
    resolved: number;
    urgent: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reservationsRes, menuRes, usersRes, contactsRes] = await Promise.all([
          apiClient.getReservations({ limit: 1 }),
          apiClient.getMenuItems({ limit: 1 }),
          apiClient.getUsers({ limit: 1 }),
          apiClient.getContacts({ limit: 1 }),
        ]);

        const [reservationsStatusRes, menuStatusRes, usersStatusRes, contactsStatsRes] = await Promise.all([
          apiClient.getReservations({ status: 'pending', limit: 1 }),
          apiClient.getMenuItems({ limit: 1 }),
          apiClient.getUsers({ isActive: true, limit: 1 }),
          apiClient.getContactStats(),
        ]);

        setStats({
          reservations: {
            total: reservationsRes.data?.total || 0,
            pending: reservationsStatusRes.data?.total || 0,
            confirmed: 0, // Would need separate API call
            cancelled: 0, // Would need separate API call
          },
          menuItems: {
            total: menuRes.data?.total || 0,
            available: menuStatusRes.data?.total || 0,
            featured: 0, // Would need separate API call
          },
          users: {
            total: usersRes.data?.total || 0,
            active: usersStatusRes.data?.total || 0,
            admins: 0, // Would need separate API call
          },
          contacts: {
            total: contactsRes.data?.total || 0,
            new: contactsStatsRes.data?.new || 0,
            resolved: contactsStatsRes.data?.resolved || 0,
            urgent: contactsStatsRes.data?.urgent || 0,
          },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Reservations',
      value: stats?.reservations.total || 0,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      change: stats?.reservations.pending || 0,
      changeLabel: 'Pending',
    },
    {
      name: 'Menu Items',
      value: stats?.menuItems.total || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      change: stats?.menuItems.available || 0,
      changeLabel: 'Available',
    },
    {
      name: 'Total Users',
      value: stats?.users.total || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: stats?.users.active || 0,
      changeLabel: 'Active',
    },
    {
      name: 'Contact Messages',
      value: stats?.contacts.total || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-orange-500',
      change: stats?.contacts.new || 0,
      changeLabel: 'New',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Sundate Matcha admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {card.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {card.change} {card.changeLabel}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-gray-400">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <ClockIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Pending Reservations
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Review and confirm pending reservations
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-gray-400">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Manage Menu
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add, edit, or remove menu items
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-gray-400">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Contact Messages
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Respond to customer inquiries
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-gray-400">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <UsersIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  User Management
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage user accounts and permissions
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New reservation confirmed for <span className="font-medium text-gray-900">John Doe</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>2 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Menu item <span className="font-medium text-gray-900">Matcha Latte</span> was updated
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>4 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center ring-8 ring-white">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New contact message from <span className="font-medium text-gray-900">Jane Smith</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>6 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
