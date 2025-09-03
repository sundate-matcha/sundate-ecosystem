'use client';

import { useEffect, useState } from 'react';
import { apiClient, Reservation } from '@/lib/api';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]);

  const fetchReservations = async () => {
    try {
      const params: any = { limit: 50 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (dateFilter) {
        params.date = dateFilter;
      }
      
      const response = await apiClient.getReservations(params);
      if (response.data) {
        setReservations(response.data.reservations);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      if (status === 'confirmed') {
        await apiClient.confirmReservation(id);
      } else if (status === 'cancelled') {
        await apiClient.cancelReservation(id);
      } else {
        await apiClient.updateReservation(id, { status: status as any });
      }
      fetchReservations();
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      try {
        await apiClient.deleteReservation(id);
        fetchReservations();
      } catch (error) {
        console.error('Failed to delete reservation:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage restaurant reservations and bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <li key={reservation._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {reservation.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {format(new Date(reservation.date), 'MMM dd, yyyy')}
                        <ClockIcon className="ml-4 flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {reservation.time}
                        <UserIcon className="ml-4 flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {reservation.guests} guests
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {reservation.phone}
                        {reservation.email && (
                          <>
                            <span className="mx-2">•</span>
                            {reservation.email}
                          </>
                        )}
                      </div>
                      {reservation.specialRequests && (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Special requests:</span> {reservation.specialRequests}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {reservation.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Confirm
                      </button>
                    )}
                    {reservation.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'cancelled')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reservation._id)}
                      className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {reservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
            <p className="mt-1 text-sm text-gray-500">
              No reservations found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
