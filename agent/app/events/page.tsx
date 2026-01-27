// app/events/page.tsx
'use client';

import { JSX, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  EyeIcon,
  PencilSquareIcon,
  LinkIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  HomeIcon,
  TruckIcon,
  CakeIcon
} from '@heroicons/react/24/outline';

// Type definitions
interface Event {
  id: string;
  name: string;
  type: 'MICE' | 'Wedding';
  planner: string;
  startDate: string;
  endDate: string;
  services: string[];
  totalInventory: number;
  bookedInventory: number;
  status: 'Draft' | 'Active' | 'Completed';
}

interface InventoryIconProps {
  service: string;
  className?: string;
}

// Inventory Icons Component
const InventoryIcon = ({ service, className = "" }: InventoryIconProps) => {
  const icons: Record<string, JSX.Element> = {
    hotel: <span className="text-gray-600">🏨</span>,
    transport: <span className="text-gray-600">🚗</span>,
    catering: <span className="text-gray-600">🍽️</span>
  };

  return (
    <div className={`relative ${className}`} title={service.charAt(0).toUpperCase() + service.slice(1)}>
      {icons[service] || <span>📦</span>}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Event['status'] }) => {
  const styles = {
    Draft: 'bg-gray-100 text-gray-800 border-gray-200',
    Active: 'bg-green-100 text-green-800 border-green-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// Consumption Bar Component
const ConsumptionBar = ({ booked, total }: { booked: number; total: number }) => {
  const percentage = total > 0 ? (booked / total) * 100 : 0;
  
  let barColor = 'bg-green-500';
  if (percentage >= 90) barColor = 'bg-red-500';
  else if (percentage >= 70) barColor = 'bg-yellow-500';

  const showAlert = percentage > 80;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{booked} / {total}</span>
        <span className="text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div 
          className={`h-full rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showAlert && (
        <div className="flex items-center text-xs text-amber-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mr-1"></span>
          High demand
        </div>
      )}
    </div>
  );
};

// Event Row Component
const EventRow = ({ event }: { event: Event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleView = () => {
    console.log('View event:', event.id);
    // In a real app: router.push(`/events/${event.id}`)
  };

  const handleEdit = () => {
    if (event.status === 'Completed') return;
    console.log('Edit event:', event.id);
    // In a real app: router.push(`/events/${event.id}/edit`)
  };

  const handlePlannerLink = () => {
    console.log('Open planner link for:', event.id);
    window.open('#', '_blank');
  };

  const handleGuestLink = () => {
    console.log('Open guest link for:', event.id);
    window.open('#', '_blank');
  };

  const isDisabled = event.status === 'Completed';

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${isDisabled ? 'opacity-60' : ''}`}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <button 
          onClick={handleView}
          className="text-indigo-600 hover:text-indigo-900 hover:underline"
        >
          {event.name}
        </button>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          event.type === 'MICE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
        }`}>
          {event.type}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
        <div className="flex items-center">
          <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
          {event.planner}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          {event.services.map((service) => (
            <InventoryIcon key={service} service={service} />
          ))}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
        <ConsumptionBar booked={event.bookedInventory} total={event.totalInventory} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <StatusBadge status={event.status} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleView}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleEdit}
            disabled={isDisabled}
            className={`p-1 ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
            title={isDisabled ? 'Cannot edit completed events' : 'Edit event'}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handlePlannerLink}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Open planner link"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleGuestLink}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Open guest link"
          >
            <UserGroupIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Events Table Component
const EventsTable = ({ events }: { events: Event[] }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Event Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Planner
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Event Dates
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Services
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Consumption
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Events List Page
export default function EventsListPage() {
  // Dummy data
  const [events] = useState<Event[]>([
    {
      id: '1',
      name: 'TechCorp Annual Conference 2024',
      type: 'MICE',
      planner: 'Sarah Johnson',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      services: ['hotel', 'transport', 'catering'],
      totalInventory: 50,
      bookedInventory: 47,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Smith-Wilson Destination Wedding',
      type: 'Wedding',
      planner: 'Emily Wilson',
      startDate: '2024-07-20',
      endDate: '2024-07-24',
      services: ['hotel', 'catering'],
      totalInventory: 30,
      bookedInventory: 25,
      status: 'Active'
    },
    {
      id: '3',
      name: 'Global Pharma Summit',
      type: 'MICE',
      planner: 'Michael Chen',
      startDate: '2024-05-10',
      endDate: '2024-05-12',
      services: ['hotel', 'transport'],
      totalInventory: 40,
      bookedInventory: 40,
      status: 'Completed'
    },
    {
      id: '4',
      name: 'Rodriguez-Garcia Wedding',
      type: 'Wedding',
      planner: 'Maria Rodriguez',
      startDate: '2024-08-05',
      endDate: '2024-08-08',
      services: ['hotel', 'catering', 'transport'],
      totalInventory: 25,
      bookedInventory: 15,
      status: 'Active'
    },
    {
      id: '5',
      name: 'Q4 Sales Kickoff',
      type: 'MICE',
      planner: 'David Kim',
      startDate: '2024-09-15',
      endDate: '2024-09-17',
      services: ['hotel'],
      totalInventory: 35,
      bookedInventory: 5,
      status: 'Draft'
    },
    {
      id: '6',
      name: 'Miller-Jackson Wedding',
      type: 'Wedding',
      planner: 'Jessica Miller',
      startDate: '2024-10-12',
      endDate: '2024-10-15',
      services: ['hotel', 'catering'],
      totalInventory: 20,
      bookedInventory: 20,
      status: 'Completed'
    }
  ]);

  const handleCreateEvent = () => {
    console.log('Create new event');
    // In a real app: router.push('/events/create')
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Events
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all your MICE events and destination weddings
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
              Create Event
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search events..."
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => console.log('Search:', e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => console.log('Event Type:', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="MICE">MICE</option>
                  <option value="Wedding">Wedding</option>
                </select>
                <FunnelIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => console.log('Status:', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
                <FunnelIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => console.log('Sort:', e.target.value)}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </select>
                <ChevronUpDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        {events.length > 0 ? (
          <EventsTable events={events} />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                Create Event
              </button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-indigo-100 p-3">
                  <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Events</p>
                  <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-green-100 p-3">
                  <HomeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {events.filter(e => e.status === 'Active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-100 p-3">
                  <CakeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Weddings</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {events.filter(e => e.type === 'Wedding').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-purple-100 p-3">
                  <TruckIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">MICE Events</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {events.filter(e => e.type === 'MICE').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PlusIcon component (since it's not in Heroicons)
const PlusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);