// // components/dashboard/AgentDashboard.tsx

'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
}

interface RecentEvent {
  id: string;
  name: string;
  type: 'MICE' | 'Wedding';
  planner: string;
  date: string;
  status: 'Active' | 'Draft' | 'Completed';
  consumption: number;
}

interface Activity {
  id: string;
  type: 'booking' | 'inventory_alert' | 'new_event' | 'message';
  title: string;
  description: string;
  time: string;
  icon: any;
  iconColor: string;
}

export default function AgentDashboard() {
  const [stats] = useState<Stat[]>([
    {
      name: 'Total Events',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: CalendarIcon,
    },
    {
      name: 'Active Events',
      value: '8',
      change: '+4.75%',
      changeType: 'increase',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Total Guests',
      value: '1,429',
      change: '-2.3%',
      changeType: 'decrease',
      icon: UsersIcon,
    },
    {
      name: 'Inventory Utilization',
      value: '82%',
      change: '+8.1%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
  ]);

  const [recentEvents] = useState<RecentEvent[]>([
    {
      id: '1',
      name: 'TechCorp Annual Conference 2024',
      type: 'MICE',
      planner: 'Sarah Johnson',
      date: '2024-06-15',
      status: 'Active',
      consumption: 94,
    },
    {
      id: '2',
      name: 'Smith-Wilson Wedding',
      type: 'Wedding',
      planner: 'Emily Wilson',
      date: '2024-07-20',
      status: 'Active',
      consumption: 83,
    },
    {
      id: '3',
      name: 'Q4 Sales Kickoff',
      type: 'MICE',
      planner: 'David Kim',
      date: '2024-09-15',
      status: 'Draft',
      consumption: 14,
    },
  ]);

  const [recentActivity] = useState<Activity[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New booking received',
      description: 'John Doe booked Standard Package for TechCorp Conference',
      time: '10 minutes ago',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
    },
    {
      id: '2',
      type: 'inventory_alert',
      title: 'Inventory alert',
      description: 'TechCorp Conference: 94% rooms booked (47/50)',
      time: '1 hour ago',
      icon: ExclamationCircleIcon,
      iconColor: 'text-yellow-500',
    },
    {
      id: '3',
      type: 'new_event',
      title: 'New event created',
      description: 'Rodriguez-Garcia Wedding event created by Maria Rodriguez',
      time: '2 hours ago',
      icon: CalendarIcon,
      iconColor: 'text-blue-500',
    },
    {
      id: '4',
      type: 'booking',
      title: 'New booking received',
      description: 'Jane Smith booked Premium Package for Smith-Wilson Wedding',
      time: '3 hours ago',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's what's happening with your events.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {stat.changeType === 'increase' ? (
                              <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                            )}
                            <span className="ml-1">{stat.change}</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Events */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Recent Events
                    </h3>
                    <Link
                      href="/events"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all
                    </Link>
                  </div>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                  {recentEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="truncate text-sm font-medium text-indigo-600">
                                {event.name}
                              </p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <UsersIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                {event.planner}
                              </p>
                            </div>
                            <div className="ml-4 flex flex-shrink-0 items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-900">
                                  {event.consumption}% booked
                                </div>
                                <div className="text-xs text-gray-500">{event.date}</div>
                              </div>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                  event.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : event.status === 'Draft'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-indigo-600"
                                style={{ width: `${event.consumption}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="px-4 py-4">
                      <div className="flex space-x-3">
                        <activity.icon
                          className={`h-6 w-6 flex-shrink-0 ${activity.iconColor}`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/events/create"
                className="relative block rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Create New Event
                  </span>
                </div>
              </Link>
              <Link
                href="/inventory"
                className="relative block rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Manage Inventory
                  </span>
                </div>
              </Link>
              <Link
                href="/calendar"
                className="relative block rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    View Calendar
                  </span>
                </div>
              </Link>
              <Link
                href="/analytics"
                className="relative block rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    View Analytics
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}