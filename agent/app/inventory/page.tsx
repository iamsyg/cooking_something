// app/inventory/page.tsx
'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  HomeIcon,
  TruckIcon,
  CakeIcon,
  PresentationChartBarIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/outline';

type ServiceType = 'hotel' | 'transport' | 'catering' | 'av' | 'booth' | 'gift';
type InventoryStatus = 'available' | 'locked' | 'low_stock';

interface InventoryItem {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  lockedQuantity: number;
  unitPrice: number;
  supplier: string;
  status: InventoryStatus;
  lastUpdated: string;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ServiceType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<InventoryStatus | 'all'>('all');

  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Deluxe Ocean View Room',
      type: 'hotel',
      description: 'Premium room with ocean view and king bed',
      totalQuantity: 100,
      availableQuantity: 53,
      lockedQuantity: 47,
      unitPrice: 250,
      supplier: 'Grand Marina Hotel',
      status: 'available',
      lastUpdated: '2024-01-29',
    },
    {
      id: '2',
      name: 'Standard Room',
      type: 'hotel',
      description: 'Comfortable standard room with queen bed',
      totalQuantity: 80,
      availableQuantity: 65,
      lockedQuantity: 15,
      unitPrice: 180,
      supplier: 'Grand Marina Hotel',
      status: 'available',
      lastUpdated: '2024-01-29',
    },
    {
      id: '3',
      name: 'Airport Transfer - Luxury Van',
      type: 'transport',
      description: 'Mercedes Sprinter luxury van (8 passengers)',
      totalQuantity: 20,
      availableQuantity: 8,
      lockedQuantity: 12,
      unitPrice: 150,
      supplier: 'Elite Transport Co.',
      status: 'available',
      lastUpdated: '2024-01-28',
    },
    {
      id: '4',
      name: 'Premium Buffet Package',
      type: 'catering',
      description: 'Full breakfast and lunch buffet with premium items',
      totalQuantity: 500,
      availableQuantity: 320,
      lockedQuantity: 180,
      unitPrice: 45,
      supplier: 'Gourmet Catering Services',
      status: 'available',
      lastUpdated: '2024-01-29',
    },
    {
      id: '5',
      name: 'Audio Visual Package - Conference',
      type: 'av',
      description: 'Complete AV setup with projector, mics, and screens',
      totalQuantity: 15,
      availableQuantity: 3,
      lockedQuantity: 12,
      unitPrice: 500,
      supplier: 'TechEvents AV',
      status: 'low_stock',
      lastUpdated: '2024-01-27',
    },
    {
      id: '6',
      name: 'Exhibition Booth 10x10',
      type: 'booth',
      description: 'Standard exhibition booth with carpet and draping',
      totalQuantity: 50,
      availableQuantity: 30,
      lockedQuantity: 20,
      unitPrice: 1200,
      supplier: 'ExpoSetup Inc.',
      status: 'available',
      lastUpdated: '2024-01-29',
    },
    {
      id: '7',
      name: 'Welcome Gift Package',
      type: 'gift',
      description: 'Premium branded gift bag with local items',
      totalQuantity: 300,
      availableQuantity: 150,
      lockedQuantity: 150,
      unitPrice: 50,
      supplier: 'Corporate Gifts Pro',
      status: 'available',
      lastUpdated: '2024-01-28',
    },
    {
      id: '8',
      name: 'Shuttle Bus Service',
      type: 'transport',
      description: '40-passenger coach for group transfers',
      totalQuantity: 10,
      availableQuantity: 2,
      lockedQuantity: 8,
      unitPrice: 400,
      supplier: 'Elite Transport Co.',
      status: 'low_stock',
      lastUpdated: '2024-01-29',
    },
  ]);

  const getServiceIcon = (type: ServiceType) => {
    const icons = {
      hotel: <HomeIcon className="h-5 w-5" />,
      transport: <TruckIcon className="h-5 w-5" />,
      catering: <CakeIcon className="h-5 w-5" />,
      av: <PresentationChartBarIcon className="h-5 w-5" />,
      booth: <BuildingStorefrontIcon className="h-5 w-5" />,
      gift: <GiftIcon className="h-5 w-5" />,
    };
    return icons[type];
  };

  const getServiceTypeName = (type: ServiceType) => {
    const names = {
      hotel: 'Hotel',
      transport: 'Transport',
      catering: 'Catering',
      av: 'Audio Visual',
      booth: 'Exhibition Booth',
      gift: 'Gifts & Incentives',
    };
    return names[type];
  };

  const getStatusBadge = (status: InventoryStatus) => {
    const styles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      locked: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low_stock: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      available: 'Available',
      locked: 'Partially Locked',
      low_stock: 'Low Stock',
    };

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalInventoryValue = inventoryItems.reduce(
    (sum, item) => sum + item.totalQuantity * item.unitPrice,
    0
  );

  const totalLockedValue = inventoryItems.reduce(
    (sum, item) => sum + item.lockedQuantity * item.unitPrice,
    0
  );

  const totalAvailableValue = inventoryItems.reduce(
    (sum, item) => sum + item.availableQuantity * item.unitPrice,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Inventory Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your service inventory and track availability
              </p>
            </div>
            <button
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
              Add Inventory
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Inventory Value
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                ${totalInventoryValue.toLocaleString()}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Locked Inventory
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">
                ${totalLockedValue.toLocaleString()}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Available Inventory
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
                ${totalAvailableValue.toLocaleString()}
              </dd>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ServiceType | 'all')}
                  className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotel</option>
                  <option value="transport">Transport</option>
                  <option value="catering">Catering</option>
                  <option value="av">Audio Visual</option>
                  <option value="booth">Exhibition Booth</option>
                  <option value="gift">Gifts & Incentives</option>
                </select>
                <FunnelIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as InventoryStatus | 'all')}
                  className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="locked">Partially Locked</option>
                  <option value="low_stock">Low Stock</option>
                </select>
                <FunnelIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Item
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Supplier
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Availability
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Unit Price
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
              {filteredItems.map((item) => {
                const availablePercentage = (item.availableQuantity / item.totalQuantity) * 100;
                const lockedPercentage = (item.lockedQuantity / item.totalQuantity) * 100;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          {getServiceIcon(item.type)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-gray-500">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {getServiceTypeName(item.type)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.supplier}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <LockOpenIcon className="inline h-3 w-3 mr-1" />
                            Available: {item.availableQuantity}
                          </span>
                          <span className="text-gray-500">
                            <LockClosedIcon className="inline h-3 w-3 mr-1" />
                            Locked: {item.lockedQuantity}
                          </span>
                        </div>
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                          <div className="flex h-full">
                            <div
                              className="bg-green-500"
                              style={{ width: `${availablePercentage}%` }}
                            />
                            <div
                              className="bg-yellow-500"
                              style={{ width: `${lockedPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Total: {item.totalQuantity}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                      ${item.unitPrice}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">No inventory items found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}