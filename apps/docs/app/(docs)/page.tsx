import { Calendar, Table, Shield, Bell, Smartphone } from 'lucide-react'
import { API_URL } from '@/lib/constants'

export const metadata = {
  title: 'Overview - Sundate Matcha API Documentation',
  description: 'Comprehensive API documentation for the Sundate Matcha reservation and management system'
}

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Welcome to Sundate Matcha API</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          A comprehensive REST API for managing restaurant reservations, table categories, and customer
          communications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Reservations</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage table reservations with availability checking, business hours (08:30 - 21:00), Sunday closure, and
            guest management.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <Table className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Table Categories</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage table categories with different capacities, pricing, and availability options for reservation
            management.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">User Authentication</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Secure user registration, login, logout, and profile management with JWT tokens and role-based access
            control.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Notifications</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage user notifications, track read status, archive notifications, and handle notification history for
            reservation updates and system messages.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Push Tokens</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Register and manage push notification tokens for mobile and web applications, track device usage, and send
            targeted notifications.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Quick Start</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              1
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Base URL</h4>
              <code className="text-sm bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">{API_URL}</code>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              2
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Authentication</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Most endpoints require authentication. Use JWT tokens for user authentication and admin operations.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              3
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Test the API</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Try our interactive examples or use tools like Postman to explore the endpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
