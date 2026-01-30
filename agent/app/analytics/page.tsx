// app/analytics/page.tsx
'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface MetricCard {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
}

interface ChartData {
  month: string;
  mice: number;
  weddings: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const metrics: MetricCard[] = [
    {
      name: 'Total Revenue',
      value: '$324,589',
      change: '+12.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Events Completed',
      value: '24',
      change: '+8.2%',
      changeType: 'increase',
      icon: CalendarIcon,
    },
    {
      name: 'Total Guests',
      value: '1,429',
      change: '+15.3%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Avg. Event Size',
      value: '59',
      change: '-2.4%',
      changeType: 'decrease',
      icon: ChartBarIcon,
    },
  ];

  const chartData: ChartData[] = [
    { month: 'Jan', mice: 45000, weddings: 28000, revenue: 73000 },
    { month: 'Feb', mice: 52000, weddings: 32000, revenue: 84000 },
    { month: 'Mar', mice: 48000, weddings: 35000, revenue: 83000 },
    { month: 'Apr', mice: 61000, weddings: 38000, revenue: 99000 },
    { month: 'May', mice: 55000, weddings: 42000, revenue: 97000 },
    { month: 'Jun', mice: 67000, weddings: 45000, revenue: 112000 },
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  const eventTypeBreakdown = [
    { type: 'Conferences', count: 12, percentage: 35, color: 'bg-blue-500' },
    { type: 'Weddings', count: 10, percentage: 29, color: 'bg-pink-500' },
    { type: 'Meetings', count: 8, percentage: 24, color: 'bg-indigo-500' },
    { type: 'Exhibitions', count: 4, percentage: 12, color: 'bg-purple-500' },
  ];

  const topPerformingEvents = [
    { name: 'TechCorp Annual Conference', revenue: '$45,200', guests: 150, type: 'MICE' },
    { name: 'Smith-Wilson Wedding', revenue: '$38,500', guests: 120, type: 'Wedding' },
    { name: 'Global Pharma Summit', revenue: '$52,800', guests: 200, type: 'MICE' },
    { name: 'Rodriguez-Garcia Wedding', revenue: '$32,100', guests: 95, type: 'Wedding' },
  ];

  const inventoryUtilization = [
    { category: 'Hotel Rooms', utilized: 85, color: 'bg-green-500' },
    { category: 'Transport', utilized: 72, color: 'bg-blue-500' },
    { category: 'Catering', utilized: 91, color: 'bg-yellow-500' },
    { category: 'Audio Visual', utilized: 68, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Analytics & Insights
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track performance and make data-driven decisions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    selectedPeriod === period
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <metric.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {metric.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            metric.changeType === 'increase'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {metric.changeType === 'increase' ? (
                            <ArrowUpIcon className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="ml-1">{metric.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{data.month}</span>
                    <span className="text-gray-900">${(data.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Type Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Events by Type</h3>
            <div className="space-y-4">
              {eventTypeBreakdown.map((item) => (
                <div key={item.type}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${item.color} mr-2`} />
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{item.count} events</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Top Performing Events */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Top Performing Events
            </h3>
            <div className="space-y-3">
              {topPerformingEvents.map((event, index) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500">{event.guests} guests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{event.revenue}</p>
                    <span
                      className={`text-xs font-medium ${
                        event.type === 'MICE'
                          ? 'text-blue-600'
                          : 'text-pink-600'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Utilization */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Inventory Utilization
            </h3>
            <div className="space-y-4">
              {inventoryUtilization.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.utilized}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.utilized}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="flex items-start">
                <ChartBarIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Optimization Opportunity</p>
                  <p className="mt-1">
                    Consider increasing Audio Visual inventory. Current utilization is
                    below target of 75%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            MICE vs Weddings Revenue
          </h3>
          <div className="relative">
            <div className="mb-4 flex items-center justify-end space-x-6">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                <span className="text-sm text-gray-600">MICE Events</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-500 mr-2" />
                <span className="text-sm text-gray-600">Weddings</span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              {chartData.map((data) => (
                <div key={data.month} className="flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative w-full" style={{ height: '200px' }}>
                      <div className="absolute bottom-0 w-full flex space-x-1">
                        <div
                          className="flex-1 bg-blue-500 rounded-t"
                          style={{
                            height: `${(data.mice / maxRevenue) * 200}px`,
                          }}
                        />
                        <div
                          className="flex-1 bg-pink-500 rounded-t"
                          style={{
                            height: `${(data.weddings / maxRevenue) * 200}px`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{data.month}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}