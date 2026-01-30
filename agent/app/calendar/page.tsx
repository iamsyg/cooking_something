// app/calendar/page.tsx
'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: string;
  name: string;
  type: 'MICE' | 'Wedding';
  startDate: Date;
  endDate: Date;
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1)); // June 2024

  const events: CalendarEvent[] = [
    {
      id: '1',
      name: 'TechCorp Annual Conference',
      type: 'MICE',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 18),
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Smith-Wilson Wedding',
      type: 'Wedding',
      startDate: new Date(2024, 6, 20),
      endDate: new Date(2024, 6, 24),
      color: 'bg-pink-500',
    },
    {
      id: '3',
      name: 'Global Pharma Summit',
      type: 'MICE',
      startDate: new Date(2024, 4, 10),
      endDate: new Date(2024, 4, 12),
      color: 'bg-blue-500',
    },
    {
      id: '4',
      name: 'Rodriguez-Garcia Wedding',
      type: 'Wedding',
      startDate: new Date(2024, 7, 5),
      endDate: new Date(2024, 7, 8),
      color: 'bg-pink-500',
    },
    {
      id: '5',
      name: 'Q4 Sales Kickoff',
      type: 'MICE',
      startDate: new Date(2024, 8, 15),
      endDate: new Date(2024, 8, 17),
      color: 'bg-blue-500',
    },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(date);
      
      // Set all times to midnight for comparison
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Event Calendar
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View all your events in a calendar format
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <button
            onClick={previousMonth}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToToday}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Today
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="border-r border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const dayEvents = getEventsForDay(date);
              const today = isToday(date);
              const isCurrentMonth = date !== null;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-b border-r border-gray-200 p-2 last:border-r-0 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {date && (
                    <>
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                            today
                              ? 'bg-indigo-600 font-semibold text-white'
                              : 'font-medium text-gray-700'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`${event.color} cursor-pointer rounded px-2 py-1 text-xs font-medium text-white hover:opacity-90`}
                            title={event.name}
                          >
                            <div className="truncate">{event.name}</div>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="px-2 text-xs font-medium text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Event Types</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded bg-blue-500"></div>
              <span className="ml-2 text-sm text-gray-700">MICE Events</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded bg-pink-500"></div>
              <span className="ml-2 text-sm text-gray-700">Destination Weddings</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Upcoming Events This Month
          </h3>
          <div className="space-y-3">
            {events
              .filter((event) => {
                const eventMonth = event.startDate.getMonth();
                const eventYear = event.startDate.getFullYear();
                return (
                  eventMonth === currentDate.getMonth() &&
                  eventYear === currentDate.getFullYear()
                );
              })
              .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-3 w-3 rounded-full ${event.color}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500">
                        {event.startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        -{' '}
                        {event.endDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      event.type === 'MICE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            {events.filter((event) => {
              const eventMonth = event.startDate.getMonth();
              const eventYear = event.startDate.getFullYear();
              return (
                eventMonth === currentDate.getMonth() &&
                eventYear === currentDate.getFullYear()
              );
            }).length === 0 && (
              <div className="py-8 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No events scheduled for this month
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}