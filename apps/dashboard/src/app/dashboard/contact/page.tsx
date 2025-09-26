'use client';

import { useEffect, useState } from 'react';
import { apiClient, Contact } from '@/lib/api';
import {
  ChatBubbleLeftRightIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [statusFilter, priorityFilter]);

  const fetchContacts = async () => {
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }
      
      const response = await apiClient.getContacts(params);
      if (response.data) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiClient.updateContact(id, { status: status as any });
      fetchContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await apiClient.resolveContact(id);
      fetchContacts();
    } catch (error) {
      console.error('Failed to resolve contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact message?')) {
      try {
        await apiClient.deleteContact(id);
        fetchContacts();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer inquiries and support requests
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
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Contact Messages */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                          {contact.priority}
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm font-medium text-gray-900">{contact.subject}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {contact.email}
                        {contact.phone && (
                          <>
                            <PhoneIcon className="ml-4 flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {contact.phone}
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        <p>Category: {contact.category}</p>
                        <p>Received: {new Date(contact.createdAt).toLocaleDateString()}</p>
                        {contact.assignedTo && (
                          <p>Assigned to: {contact.assignedTo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {contact.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(contact._id, 'in-progress')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Start
                      </button>
                    )}
                    {contact.status === 'in-progress' && (
                      <button
                        onClick={() => handleResolve(contact._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
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
        {contacts.length === 0 && (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contact messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              No contact messages found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Contact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Messages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contacts.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">N</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    New Messages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contacts.filter(c => c.status === 'new').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contacts.filter(c => c.status === 'resolved').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Urgent
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contacts.filter(c => c.priority === 'urgent').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
