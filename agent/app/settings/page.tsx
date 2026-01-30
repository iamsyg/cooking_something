// app/settings/page.tsx
'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing' | 'preferences';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  // Profile settings
  const [name, setName] = useState('John Agent');
  const [email, setEmail] = useState('john.agent@tbo.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [company, setCompany] = useState('TBO Travel');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newBooking: true,
    inventoryAlert: true,
    eventReminder: true,
    weeklyReport: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    newBooking: true,
    inventoryAlert: true,
    eventReminder: false,
  });

  // Preference settings
  const [timezone, setTimezone] = useState('America/New_York');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Save Success Message */}
        {saved && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 rounded-lg bg-white p-4 shadow">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white p-6 shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="h-24 w-24 rounded-full"
                      />
                      <div>
                        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                          Change Photo
                        </button>
                        <p className="mt-2 text-xs text-gray-500">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">
                    Notification Preferences
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Email Notifications
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">New Bookings</p>
                            <p className="text-sm text-gray-500">
                              Get notified when a guest makes a new booking
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications.newBooking}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                newBooking: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Inventory Alerts
                            </p>
                            <p className="text-sm text-gray-500">
                              Alerts when inventory reaches threshold levels
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications.inventoryAlert}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                inventoryAlert: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Event Reminders
                            </p>
                            <p className="text-sm text-gray-500">
                              Reminders about upcoming events
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications.eventReminder}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                eventReminder: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Weekly Reports</p>
                            <p className="text-sm text-gray-500">
                              Weekly summary of your events and bookings
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications.weeklyReport}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                weeklyReport: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Push Notifications
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">New Bookings</p>
                            <p className="text-sm text-gray-500">
                              Push notifications for new bookings
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications.newBooking}
                            onChange={(e) =>
                              setPushNotifications({
                                ...pushNotifications,
                                newBooking: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Inventory Alerts
                            </p>
                            <p className="text-sm text-gray-500">
                              Push alerts for inventory thresholds
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications.inventoryAlert}
                            onChange={(e) =>
                              setPushNotifications({
                                ...pushNotifications,
                                inventoryAlert: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Event Reminders
                            </p>
                            <p className="text-sm text-gray-500">
                              Push reminders for upcoming events
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications.eventReminder}
                            onChange={(e) =>
                              setPushNotifications({
                                ...pushNotifications,
                                eventReminder: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">
                    Security Settings
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Two-Factor Authentication
                      </h3>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Two-factor authentication is not enabled
                            </p>
                            <p className="text-sm text-gray-500">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Active Sessions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center space-x-4">
                            <KeyIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Chrome on MacOS
                              </p>
                              <p className="text-sm text-gray-500">
                                New York, USA • Active now
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-green-600">
                            Current Session
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">
                    Billing & Subscription
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Current Plan
                      </h3>
                      <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              Professional Plan
                            </p>
                            <p className="text-sm text-gray-600">
                              Unlimited events and advanced features
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">$99</p>
                            <p className="text-sm text-gray-600">per month</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Payment Method
                      </h3>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <CreditCardIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Visa ending in 4242
                              </p>
                              <p className="text-sm text-gray-500">Expires 12/2025</p>
                            </div>
                          </div>
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Billing History
                      </h3>
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Description
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            <tr>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                Jan 1, 2024
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                Professional Plan
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                $99.00
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm">
                                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                  Paid
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                Dec 1, 2023
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                Professional Plan
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                $99.00
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm">
                                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                  Paid
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date Format
                      </label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                <button
                  onClick={handleSave}
                  className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}