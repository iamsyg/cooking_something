// components/CreateEventStepFour.tsx
import React from 'react';
import { 
  InformationCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import type { EventType, MiceSubType, InventoryItem, Package, RoomBlock } from '@/types/event';

interface MicrositeConfig {
  themeLogo?: File | null;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  showItinerary: boolean;
  showPackages: boolean;
  customDomain?: string;
}

interface ItineraryDay {
  id: string;
  day: number;
  date: string;
  title: string;
  activities: ItineraryActivity[];
}

interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface CreateEventStepFourProps {
  eventType: EventType;
  miceSubType?: MiceSubType;
  eventName: string;
  location: string;
  plannerName: string;
  plannerEmail: string;
  startDate: string;
  endDate: string;
  description?: string;
  attendeeCount?: string;
  bookingEndDate: string;
  roomBlocks: RoomBlock[];
  inventoryItems: InventoryItem[];
  packages: Package[];
  micrositeConfig?: MicrositeConfig;
  itinerary?: ItineraryDay[];
}

const CreateEventStepFour: React.FC<CreateEventStepFourProps> = ({
  eventType = 'MICE',
  miceSubType = 'Conferences',
  eventName = '',
  location = '',
  plannerName = '',
  plannerEmail = '',
  startDate = '',
  endDate = '',
  description = '',
  attendeeCount = '',
  bookingEndDate = '',
  roomBlocks = [],
  inventoryItems = [],
  packages = [],
  micrositeConfig = {
    primaryColor: '#4F46E5',
    secondaryColor: '#EC4899',
    welcomeMessage: '',
    showItinerary: true,
    showPackages: true,
    customDomain: ''
  },
  itinerary = []
}) => {
  
  const getFilteredInventoryItems = () => {
    return inventoryItems.filter(item => 
      item.requiredFor.includes(miceSubType) || eventType === 'Wedding'
    );
  };

  const totalActivities = itinerary.reduce((acc, day) => acc + day.activities.length, 0);
    
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Event Details</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500">Event Name</label>
            <p className="text-sm font-medium text-gray-900">{eventName || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Type</label>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${eventType === 'MICE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                {eventType}
              </span>
              {eventType === 'MICE' && (
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  {miceSubType}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Dates</label>
            <p className="text-sm text-gray-900">
              {startDate ? new Date(startDate).toLocaleDateString() : 'Not set'} 
              {endDate ? ` to ${new Date(endDate).toLocaleDateString()}` : ''}
            </p>
          </div>
          {eventType === 'MICE' && attendeeCount && (
            <div>
              <label className="block text-xs font-medium text-gray-500">Expected Attendees</label>
              <p className="text-sm text-gray-900">{attendeeCount}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500">Location</label>
            <p className="text-sm text-gray-900">{location || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Planner</label>
            <p className="text-sm text-gray-900">{plannerName || 'Not specified'}</p>
            <p className="text-xs text-gray-500">{plannerEmail || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Booking Window</label>
            <p className="text-sm text-gray-900">
              Closes on {bookingEndDate ? new Date(bookingEndDate).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          {description && (
            <div>
              <label className="block text-xs font-medium text-gray-500">Description</label>
              <p className="text-sm text-gray-900">{description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Blocks Summary */}
      {roomBlocks.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center">
            <LockClosedIcon className="h-4 w-4 mr-2 text-green-600" />
            Locked Room Inventory
          </h3>
          <div className="space-y-2">
            {roomBlocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-green-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{block.hotelName} - {block.roomType}</p>
                  <p className="text-xs text-gray-500">
                    {block.totalRooms} rooms blocked · 
                    {block.releaseDate ? ` Releases ${new Date(block.releaseDate).toLocaleDateString()}` : ' No release date set'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${block.ratePerNight}/night</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packages Summary */}
      {packages.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Guest Packages</h3>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
                    {pkg.isDefault && (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">${pkg.basePrice}</p>
                </div>
                <p className="text-xs text-gray-500 mb-2">{pkg.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Includes:</span>
                  {getFilteredInventoryItems()
                    .filter(item => item.included)
                    .slice(0, 3)
                    .map(item => (
                      <span key={item.id} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        {item.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Microsite Preview */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Microsite Configuration</h3>
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center space-x-4 mb-3">
            <div
              className="h-12 w-12 rounded-lg"
              style={{ backgroundColor: micrositeConfig.primaryColor }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Branded Microsite</p>
              <p className="text-xs text-gray-500">Primary: {micrositeConfig.primaryColor}</p>
              <p className="text-xs text-gray-500">Secondary: {micrositeConfig.secondaryColor}</p>
            </div>
          </div>
          {micrositeConfig.welcomeMessage && (
            <p className="text-sm text-gray-700 mb-3">{micrositeConfig.welcomeMessage}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {micrositeConfig.showItinerary && <span>✓ Itinerary visible</span>}
            {micrositeConfig.showPackages && <span>✓ Package selection enabled</span>}
            {micrositeConfig.showItinerary && <span>✓ {totalActivities} activities scheduled</span>}
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      {inventoryItems.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Services & Inventory</h3>
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Included Services</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {getFilteredInventoryItems()
                    .filter(item => item.included)
                    .map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.unitPrice} × {item.quantity}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Optional Upgrades</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {getFilteredInventoryItems()
                    .filter(item => item.isOptionalUpgrade)
                    .map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>+${item.unitPrice}</span>
                      </li>
                    ))}
                  {getFilteredInventoryItems().filter(item => item.isOptionalUpgrade).length === 0 && (
                    <li className="text-gray-400">No optional upgrades</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="mb-8">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">What happens next:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Room inventory will be locked and removed from general availability</li>
                <li>Two unique links will be generated: Planner Dashboard & Guest Microsite</li>
                <li>Guests can book until {bookingEndDate ? new Date(bookingEndDate).toLocaleDateString() : 'the booking deadline'}, then unused rooms auto-release</li>
                <li>Planner can track consumption and request more inventory anytime</li>
                <li>All bookings will be centralized with automated confirmations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mb-8">
        <label className="flex items-start">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-600">
            I confirm all information is accurate. I understand that inventory will be locked, links will be generated,
            and this event will go live immediately upon creation.
          </span>
        </label>
      </div>
    </div>
  );
};

export default CreateEventStepFour;