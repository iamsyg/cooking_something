// components/CreateEventStepTwo.tsx
"use client";

import React from 'react';
import {
  HomeIcon,
  TruckIcon,
  CakeIcon,
  PresentationChartBarIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  LockClosedIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

import type { EventType, MiceSubType, ServiceType, PricingModel, InventoryItem, Package, RoomBlock } from '@/types/event';

interface CreateEventStepTwoProps {
  bookingEndDate?: string;
  eventType?: EventType;
  miceSubType?: MiceSubType;
  roomBlocks: RoomBlock[];
  inventoryItems: InventoryItem[];
  packages: Package[];
  onRoomBlocksChange: (roomBlocks: RoomBlock[]) => void;
  onInventoryItemsChange: (inventoryItems: InventoryItem[]) => void;
  onPackagesChange: (packages: Package[]) => void;
}

const CreateEventStepTwo: React.FC<CreateEventStepTwoProps> = ({
  bookingEndDate = '',
  eventType = 'MICE',
  miceSubType = 'Conferences',
  roomBlocks = [],
  inventoryItems = [],
  packages = [],
  onRoomBlocksChange,
  onInventoryItemsChange,
  onPackagesChange
}) => {
  // Room Block Functions
  const addRoomBlock = () => {
    const newRoomBlock: RoomBlock = {
      id: Date.now().toString(),
      hotelName: '',
      roomType: '',
      totalRooms: 1,
      ratePerNight: 0,
      amenities: [],
      locked: true,
      releaseDate: bookingEndDate || ''
    };
    onRoomBlocksChange([...roomBlocks, newRoomBlock]);
  };

  const removeRoomBlock = (id: string) => {
    onRoomBlocksChange(roomBlocks.filter(block => block.id !== id));
  };

  const updateRoomBlock = (id: string, field: keyof RoomBlock, value: any) => {
    const newRoomBlocks = roomBlocks.map(block =>
      block.id === id ? { ...block, [field]: value } : block
    );
    onRoomBlocksChange(newRoomBlocks);
  };

  // Inventory Item Functions
  const addInventoryItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: '',
      type: 'hotel',
      description: '',
      quantity: 1,
      unitPrice: 0,
      pricingModel: 'perPerson',
      included: true,
      isOptionalUpgrade: false,
      requiredFor: eventType === 'MICE' ? [miceSubType] : ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'],
    };
    onInventoryItemsChange([...inventoryItems, newItem]);
  };

  const removeInventoryItem = (id: string) => {
    onInventoryItemsChange(inventoryItems.filter(item => item.id !== id));
  };

  const updateInventoryItem = (id: string, field: keyof InventoryItem, value: any) => {
    const newInventoryItems = inventoryItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onInventoryItemsChange(newInventoryItems);
  };

  // Package Functions
  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: '',
      description: '',
      basePrice: 0,
      includedServices: [],
      optionalUpgrades: [],
      isDefault: packages.length === 0
    };
    onPackagesChange([...packages, newPackage]);
  };

  const removePackage = (id: string) => {
    onPackagesChange(packages.filter(pkg => pkg.id !== id));
  };

  const updatePackage = (id: string, field: keyof Package, value: any) => {
    const newPackages = packages.map(pkg => {
      if (pkg.id === id) {
        return { ...pkg, [field]: value };
      }
      if (field === 'isDefault' && value === true) {
        return { ...pkg, isDefault: false };
      }
      return pkg;
    });
    onPackagesChange(newPackages);
  };

  // Helper Functions
  const getFilteredInventoryItems = () => {
    return inventoryItems.filter(item =>
      item.requiredFor.includes(miceSubType) || eventType === 'Wedding'
    );
  };

  const getServiceIcon = (type: ServiceType) => {
    const icons = {
      hotel: <HomeIcon className="h-5 w-5" />,
      transport: <TruckIcon className="h-5 w-5" />,
      catering: <CakeIcon className="h-5 w-5" />,
      av: <PresentationChartBarIcon className="h-5 w-5" />,
      internet: <BuildingOfficeIcon className="h-5 w-5" />,
      booth: <BuildingStorefrontIcon className="h-5 w-5" />,
      gift: <GiftIcon className="h-5 w-5" />,
    };
    return icons[type] || <HomeIcon className="h-5 w-5" />;
  };

  const getServiceOptions = () => {
    const baseOptions = [
      { value: 'hotel', label: 'Hotel' },
      { value: 'transport', label: 'Transport' },
      { value: 'catering', label: 'Catering' },
    ];

    if (eventType === 'MICE') {
      const miceOptions = [
        { value: 'av', label: 'Audio Visual' },
        { value: 'internet', label: 'Internet' },
        { value: 'booth', label: 'Exhibition Booth' },
        { value: 'gift', label: 'Incentives & Gifts' },
      ];
      return [...baseOptions, ...miceOptions];
    }

    return baseOptions;
  };

  const getPricingModelOptions = () => {
    const baseOptions = [
      { value: 'perPerson', label: 'Per Person' },
      { value: 'perRoom', label: 'Per Room' },
      { value: 'package', label: 'Package' },
    ];

    if (eventType === 'MICE') {
      const miceOptions = [
        { value: 'perDay', label: 'Per Day' },
        { value: 'perBooth', label: 'Per Booth' },
      ];
      return [...baseOptions, ...miceOptions];
    }

    return baseOptions;
  };

  const calculateTotalValue = (item: InventoryItem) => {
    return item.quantity * item.unitPrice;
  };

  return (
    <div className="space-y-6">
      {/* Room Blocks Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <LockClosedIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Room Blocks (Locked Inventory)
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These rooms are exclusively reserved for your event and blocked from general availability
            </p>
          </div>
          <button
            type="button"
            onClick={addRoomBlock}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
            Add Room Block
          </button>
        </div>

        <div className="space-y-4">
          {roomBlocks.map((block) => (
            <div key={block.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">Room Block</h3>
                  {block.locked && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      <LockClosedIcon className="h-3 w-3 mr-1" />
                      Locked
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeRoomBlock(block.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    value={block.hotelName}
                    onChange={(e) => updateRoomBlock(block.id, 'hotelName', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Room Type *</label>
                  <input
                    type="text"
                    required
                    value={block.roomType}
                    onChange={(e) => updateRoomBlock(block.id, 'roomType', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Rooms Blocked *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={block.totalRooms}
                    onChange={(e) => updateRoomBlock(block.id, 'totalRooms', parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Rate/Night ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={block.ratePerNight}
                    onChange={(e) => updateRoomBlock(block.id, 'ratePerNight', parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Release Date</label>
                  <input
                    type="date"
                    value={block.releaseDate || ''}
                    onChange={(e) => updateRoomBlock(block.id, 'releaseDate', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Unused rooms auto-release</p>
                </div>
              </div>
            </div>
          ))}

          {roomBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <HomeIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm">No room blocks added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Services & Inclusions Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Services & Inclusions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Define what's included and available as optional upgrades
            </p>
          </div>
          <button
            type="button"
            onClick={addInventoryItem}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {getFilteredInventoryItems().map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    {getServiceIcon(item.type)}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)}
                      className="border-0 bg-transparent p-0 text-sm font-medium text-gray-900 focus:ring-0"
                      placeholder="Service name"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInventoryItem(item.id, 'description', e.target.value)}
                      className="mt-1 w-full border-0 bg-transparent p-0 text-sm text-gray-500 focus:ring-0"
                      placeholder="Description"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={(e) => updateInventoryItem(item.id, 'included', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Include in base</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isOptionalUpgrade}
                      onChange={(e) => updateInventoryItem(item.id, 'isOptionalUpgrade', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Optional upgrade</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeInventoryItem(item.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Service Type</label>
                  <select
                    value={item.type}
                    onChange={(e) => updateInventoryItem(item.id, 'type', e.target.value as ServiceType)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {getServiceOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateInventoryItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateInventoryItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Pricing Model</label>
                  <select
                    value={item.pricingModel}
                    onChange={(e) => updateInventoryItem(item.id, 'pricingModel', e.target.value as PricingModel)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {getPricingModelOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Total</label>
                  <div className="mt-1 text-lg font-medium text-gray-900">
                    ${calculateTotalValue(item).toLocaleString()}
                  </div>
                </div>
              </div>

              {item.isOptionalUpgrade && (
                <div className="mt-3 rounded-md bg-blue-50 p-3">
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-sm text-blue-700">
                      This service will be available as an optional upgrade for +${item.unitPrice} {item.pricingModel.replace('per', '/')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Packages Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Packages
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create packages that bundle services together
            </p>
          </div>
          <button
            type="button"
            onClick={addPackage}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
            Add Package
          </button>
        </div>

        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                    className="font-medium text-gray-900 bg-transparent border-0 focus:ring-0 text-sm"
                    placeholder="Package name"
                  />
                  {pkg.isDefault && (
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pkg.isDefault}
                      onChange={(e) => updatePackage(pkg.id, 'isDefault', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Set as default</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removePackage(pkg.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  value={pkg.description}
                  onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Package description"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pkg.basePrice}
                    onChange={(e) => updatePackage(pkg.id, 'basePrice', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Included Services
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getFilteredInventoryItems()
                      .filter(item => item.included)
                      .map(item => (
                        <span key={item.id} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {item.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Available Upgrades (guests can add these)
                </label>
                <div className="flex flex-wrap gap-2">
                  {getFilteredInventoryItems()
                    .filter(item => item.isOptionalUpgrade)
                    .map(item => (
                      <span key={item.id} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {item.name} (+${item.unitPrice})
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateEventStepTwo;