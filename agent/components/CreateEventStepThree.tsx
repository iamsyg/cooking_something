// components/CreateEventStepThree.tsx
import React from 'react';
import {
  CalendarIcon,
  GlobeAltIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import type { EventType, MiceSubType } from '@/types/event';

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

interface CreateEventStepThreeProps {
  eventName: string;
  eventType: EventType;
  miceSubType?: MiceSubType;
  itinerary: ItineraryDay[];
  micrositeConfig: MicrositeConfig;
  onItineraryChange: (itinerary: ItineraryDay[]) => void;
  onMicrositeConfigChange: (config: MicrositeConfig) => void;
}

const CreateEventStepThree: React.FC<CreateEventStepThreeProps> = ({
  eventName,
  eventType,
  miceSubType = 'Conferences',
  itinerary = [],
  micrositeConfig,
  onItineraryChange,
  onMicrositeConfigChange,
}) => {
  const addItineraryActivity = (dayId: string) => {
    const newActivity: ItineraryActivity = {
      id: Date.now().toString(),
      time: '09:00',
      title: '',
      description: '',
      location: ''
    };

    const newItinerary = itinerary.map(day =>
      day.id === dayId
        ? { ...day, activities: [...day.activities, newActivity] }
        : day
    );
    onItineraryChange(newItinerary);
  };

  const removeItineraryActivity = (dayId: string, activityId: string) => {
    const newItinerary = itinerary.map(day =>
      day.id === dayId
        ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
        : day
    );
    onItineraryChange(newItinerary);
  };

  const updateItineraryDay = (dayId: string, field: keyof ItineraryDay, value: string) => {
    const newItinerary = itinerary.map(day =>
      day.id === dayId ? { ...day, [field]: value } : day
    );
    onItineraryChange(newItinerary);
  };

  const updateItineraryActivity = (
    dayId: string,
    activityId: string,
    field: keyof ItineraryActivity,
    value: string
  ) => {
    const newItinerary = itinerary.map(day =>
      day.id === dayId
        ? {
          ...day,
          activities: day.activities.map(activity =>
            activity.id === activityId ? { ...activity, [field]: value } : activity
          ),
        }
        : day
    );
    onItineraryChange(newItinerary);
  };

  const updateMicrositeConfig = (field: keyof MicrositeConfig, value: any) => {
    onMicrositeConfigChange({ ...micrositeConfig, [field]: value });
  };

  // Auto-generate welcome message if empty
  React.useEffect(() => {
    if (!micrositeConfig.welcomeMessage && eventName) {
      if (eventType === 'MICE') {
        updateMicrositeConfig('welcomeMessage', 
          `Welcome to ${eventName}! We're excited to have you join us for this ${miceSubType.toLowerCase()} event.`
        );
      } else {
        updateMicrositeConfig('welcomeMessage',
          `Welcome to our special day! We're thrilled to celebrate with you.`
        );
      }
    }
  }, [eventName, eventType, miceSubType]);

  return (
    <div className="space-y-6">
      {/* Branding Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <GlobeAltIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Microsite Branding
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Customize the look and feel of your event microsite
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {micrositeConfig.themeLogo ? (
                  <span className="text-xs text-gray-500">Logo uploaded</span>
                ) : (
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    // Handle file upload
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: any) => {
                      if (e.target.files?.[0]) {
                        updateMicrositeConfig('themeLogo', e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                >
                  Upload Logo
                </button>
                <p className="mt-1 text-xs text-gray-500">PNG or JPG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={micrositeConfig.primaryColor}
                  onChange={(e) => updateMicrositeConfig('primaryColor', e.target.value)}
                  className="h-10 w-20 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={micrositeConfig.primaryColor}
                  onChange={(e) => updateMicrositeConfig('primaryColor', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={micrositeConfig.secondaryColor}
                  onChange={(e) => updateMicrositeConfig('secondaryColor', e.target.value)}
                  className="h-10 w-20 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={micrositeConfig.secondaryColor}
                  onChange={(e) => updateMicrositeConfig('secondaryColor', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Message
            </label>
            <textarea
              value={micrositeConfig.welcomeMessage}
              onChange={(e) => updateMicrositeConfig('welcomeMessage', e.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Welcome message for guests..."
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={micrositeConfig.showItinerary}
                onChange={(e) => updateMicrositeConfig('showItinerary', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show event itinerary to guests</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={micrositeConfig.showPackages}
                onChange={(e) => updateMicrositeConfig('showPackages', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow guests to select packages</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Domain (Optional)
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                https://
              </span>
              <input
                type="text"
                value={micrositeConfig.customDomain || ''}
                onChange={(e) => updateMicrositeConfig('customDomain', e.target.value)}
                className="block w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="your-event.example.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You'll need to configure DNS separately
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Builder */}
      {micrositeConfig.showItinerary && itinerary.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Event Itinerary
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Build a day-by-day schedule for your event
            </p>
          </div>

          <div className="space-y-4">
            {itinerary.map((day) => (
              <div key={day.id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateItineraryDay(day.id, 'title', e.target.value)}
                        className="text-base font-medium text-gray-900 bg-transparent border-0 focus:ring-0 p-0"
                        placeholder={`Day ${day.day} Title`}
                      />
                      <p className="text-sm text-gray-500">{day.date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItineraryActivity(day.id)}
                      className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Activity
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md">
                      <input
                        type="time"
                        value={activity.time}
                        onChange={(e) => updateItineraryActivity(day.id, activity.id, 'time', e.target.value)}
                        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={activity.title}
                          onChange={(e) => updateItineraryActivity(day.id, activity.id, 'title', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Activity title"
                        />
                        <input
                          type="text"
                          value={activity.description}
                          onChange={(e) => updateItineraryActivity(day.id, activity.id, 'description', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          value={activity.location || ''}
                          onChange={(e) => updateItineraryActivity(day.id, activity.id, 'location', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Location (optional)"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryActivity(day.id, activity.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {day.activities.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No activities scheduled. Click "Add Activity" to create one.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {micrositeConfig.showItinerary && itinerary.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No itinerary generated</h3>
          <p className="mt-1 text-sm text-gray-500">
            Set event dates in Step 1 to automatically generate an itinerary
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateEventStepThree;