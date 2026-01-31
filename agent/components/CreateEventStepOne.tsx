// components/CreateEventStepOne.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  CakeIcon,
  UsersIcon,
  GiftIcon,
  PresentationChartBarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { CustomField } from '@/types/event';

type EventType = 'MICE' | 'Wedding';
type MiceSubType = 'Meetings' | 'Incentives' | 'Conferences' | 'Exhibitions';

interface CreateEventStepOneProps {
  eventType: EventType;
  miceSubType: MiceSubType;
  eventName: string;
  location: string;
  plannerName: string;
  plannerEmail: string;
  startDate: string;
  endDate: string;
  description: string;
  attendeeCount: string;
  bookingStartDate: string;
  bookingEndDate: string;
  customFields: CustomField[];
  onCustomFieldChange: (id: string, value: string) => void;
  onEventTypeChange: (type: EventType) => void;
  onMiceSubTypeChange: (subType: MiceSubType) => void;
  onEventNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  onPlannerNameChange: (name: string) => void;
  onPlannerEmailChange: (email: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDescriptionChange: (description: string) => void;
  onAttendeeCountChange: (count: string) => void;
  onBookingStartDateChange: (date: string) => void;
  onBookingEndDateChange: (date: string) => void;
}

const CreateEventStepOne: React.FC<CreateEventStepOneProps> = ({
  eventType,
  miceSubType,
  eventName,
  location,
  plannerName,
  plannerEmail,
  startDate,
  endDate,
  description,
  attendeeCount,
  bookingStartDate,
  bookingEndDate,
  customFields,
  onCustomFieldChange,
  onEventTypeChange,
  onMiceSubTypeChange,
  onEventNameChange,
  onLocationChange,
  onPlannerNameChange,
  onPlannerEmailChange,
  onStartDateChange,
  onEndDateChange,
  onDescriptionChange,
  onAttendeeCountChange,
  onBookingStartDateChange,
  onBookingEndDateChange
}) => {

  // Auto-calculate meeting duration when start and end dates are set
  useEffect(() => {
    if (miceSubType === 'Meetings' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      onCustomFieldChange('2', dayCount.toString());

    }
  }, [startDate, endDate, miceSubType]);

  const getMiceSubTypeIcon = (subType: MiceSubType) => {
    switch (subType) {
      case 'Meetings': return <UsersIcon className="h-6 w-6" />;
      case 'Incentives': return <GiftIcon className="h-6 w-6" />;
      case 'Conferences': return <PresentationChartBarIcon className="h-6 w-6" />;
      case 'Exhibitions': return <BuildingStorefrontIcon className="h-6 w-6" />;
      default: return <BuildingOfficeIcon className="h-6 w-6" />;
    }
  };

  useEffect(() => {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    onEndDateChange('');
  }
}, [startDate, endDate]);

  const getCurrentFields = () => {
    return customFields.filter(field => field.forType.includes(miceSubType));
  };

  // Auto-generate placeholder text for event name
  const getEventNamePlaceholder = () => {
    if (eventType === 'MICE') {
      const baseNames: Record<MiceSubType, string> = {
        'Meetings': 'Annual Corporate Meeting',
        'Incentives': 'Employee Incentive Trip',
        'Conferences': 'Industry Conference',
        'Exhibitions': 'Trade Show Exhibition'
      };
      return baseNames[miceSubType] + ' 2024';
    }
    return 'Smith-Wilson Destination Wedding';
  };

  // Auto-calculate breakout sessions suggestion
  const getBreakoutSessionsSuggestion = () => {
    if (attendeeCount && miceSubType === 'Meetings') {
      const count = parseInt(attendeeCount);
      if (count > 0) {
        if (count <= 20) return '2-3';
        if (count <= 50) return '4-5';
        if (count <= 100) return '6-8';
        return '8+';
      }
    }
    return 'e.g., 4';
  };

  // Get field value for display
  const getFieldValue = (id: string): string => {
    const field = customFields.find(f => f.id === id);
    return field?.value || '';
  };

  const handleCustomFieldChange = (id: string, value: string) => {
    onCustomFieldChange(id, value);
  };

  return (
    <div className="space-y-6">
      {/* Event Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Event Type
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onEventTypeChange('MICE')}
            className={`flex flex-col items-center justify-center rounded-lg border p-6 ${eventType === 'MICE' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <BuildingOfficeIcon className={`h-8 w-8 ${eventType === 'MICE' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className={`mt-2 font-medium ${eventType === 'MICE' ? 'text-indigo-700' : 'text-gray-700'}`}>
              MICE Event
            </span>
            <span className="mt-1 text-xs text-gray-500">Meetings, Incentives, Conferences, Exhibitions</span>
          </button>
          <button
            type="button"
            onClick={() => onEventTypeChange('Wedding')}
            className={`flex flex-col items-center justify-center rounded-lg border p-6 ${eventType === 'Wedding' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <CakeIcon className={`h-8 w-8 ${eventType === 'Wedding' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className={`mt-2 font-medium ${eventType === 'Wedding' ? 'text-indigo-700' : 'text-gray-700'}`}>
              Destination Wedding
            </span>
            <span className="mt-1 text-xs text-gray-500">Wedding celebrations at destination venues</span>
          </button>
        </div>
      </div>

      {/* MICE Sub-Type Selection */}
      {eventType === 'MICE' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            MICE Sub-Type
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] as MiceSubType[]).map((subType) => (
              <button
                key={subType}
                type="button"
                onClick={() => onMiceSubTypeChange(subType)}
                className={`flex flex-col items-center justify-center rounded-lg border p-4 ${miceSubType === subType ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                {getMiceSubTypeIcon(subType)}
                <span className={`mt-2 text-sm font-medium ${miceSubType === subType ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {subType}
                </span>
              </button>
            ))}
          </div>
          
          {/* Sub-type Description */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              {miceSubType === 'Meetings' && 'Corporate meetings, board meetings, team meetings with focused agendas.'}
              {miceSubType === 'Incentives' && 'Employee reward trips, recognition programs with leisure activities.'}
              {miceSubType === 'Conferences' && 'Industry conferences, seminars with multiple tracks and speakers.'}
              {miceSubType === 'Exhibitions' && 'Trade shows, exhibitions with booth setups and visitor management.'}
            </p>
          </div>
        </div>
      )}

      {/* Event Details */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
            Event Name *
          </label>
          <input
            type="text"
            id="eventName"
            required
            value={eventName}
            onChange={(e) => onEventNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder={getEventNamePlaceholder()}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Miami, Florida"
          />
        </div>

        <div>
          <label htmlFor="plannerName" className="block text-sm font-medium text-gray-700">
            Planner Name *
          </label>
          <input
            type="text"
            id="plannerName"
            required
            value={plannerName}
            onChange={(e) => onPlannerNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Sarah Johnson"
          />
        </div>

        <div>
          <label htmlFor="plannerEmail" className="block text-sm font-medium text-gray-700">
            Planner Email *
          </label>
          <input
            type="email"
            id="plannerEmail"
            required
            value={plannerEmail}
            onChange={(e) => onPlannerEmailChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., sarah@example.com"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Event Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            required
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Event End Date *
          </label>
          <input
            type="date"
            id="endDate"
            required
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* MICE Specific Fields */}
        {eventType === 'MICE' && (
          <>
            <div>
              <label htmlFor="attendeeCount" className="block text-sm font-medium text-gray-700">
                Estimated Attendees *
              </label>
              <input
                type="number"
                id="attendeeCount"
                required
                value={attendeeCount}
                onChange={(e) => onAttendeeCountChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 150"
                min="1"
              />
            </div>

            {/* Custom fields for MICE sub-types */}
            {getCurrentFields().map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={getFieldValue(field.id)}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                    required={field.required}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <input
                      type={field.type}
                      value={getFieldValue(field.id)}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      required={field.required}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder={
                        field.id === '1' ? getBreakoutSessionsSuggestion() : 
                        field.id === '2' ? (startDate && endDate ? 'Auto-calculated from dates' : 'Enter duration') :
                        field.id === '3' ? 'e.g., 5000' :
                        field.id === '5' ? 'e.g., 3' :
                        field.id === '6' ? 'e.g., 15' :
                        field.id === '7' ? 'e.g., 10000' :
                        field.id === '8' ? 'e.g., 50' :
                        ''
                      }
                      min={field.type === 'number' ? "1" : undefined}
                    />
                    {field.id === '2' && startDate && endDate && (
                      <p className="mt-1 text-xs text-gray-500">
                        Calculated based on selected dates: {getFieldValue('2')} days
                      </p>
                    )}
                    {field.id === '1' && attendeeCount && (
                      <p className="mt-1 text-xs text-gray-500">
                        Suggested: {getBreakoutSessionsSuggestion()} breakout sessions
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Wedding Specific Fields */}
        {eventType === 'Wedding' && (
          <div className="col-span-2">
            <label htmlFor="attendeeCount" className="block text-sm font-medium text-gray-700">
              Estimated Attendee Count *
            </label>
            <input
              type="number"
              id="attendeeCount"
              required
              value={attendeeCount}
              onChange={(e) => onAttendeeCountChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., 150"
              min="1"
              
            />
          </div>
        )}

        {/* Booking Validity Period */}
        <div>
          <label htmlFor="bookingStartDate" className="block text-sm font-medium text-gray-700">
            Booking Window Opens On
          </label>
          <input
            type="date"
            id="bookingStartDate"
            value={bookingStartDate}
            onChange={(e) => onBookingStartDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Guests can book from this date (defaults to 7 days before event)</p>
        </div>
        <div>
          <label htmlFor="bookingEndDate" className="block text-sm font-medium text-gray-700">
            Booking Window Closes On
          </label>
          <input
            type="date"
            id="bookingEndDate"
            value={bookingEndDate}
            onChange={(e) => onBookingEndDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Guests can book until this date (defaults to 7 days before event)</p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Event Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder="Brief description of the event..."
        />
      </div>
    </div>
  );
};

export default CreateEventStepOne;