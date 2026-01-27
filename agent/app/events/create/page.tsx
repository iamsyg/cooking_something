// app/events/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BuildingOfficeIcon, 
  CakeIcon, 
  CalendarIcon,
  UserGroupIcon,
  HomeIcon,
  TruckIcon,
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  UsersIcon,
  GiftIcon,
  PresentationChartBarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

type EventType = 'MICE' | 'Wedding';
type MiceSubType = 'Meetings' | 'Incentives' | 'Conferences' | 'Exhibitions';
type ServiceType = 'hotel' | 'transport' | 'catering' | 'av' | 'internet' | 'booth' | 'gift';
type PricingModel = 'perPerson' | 'perRoom' | 'package' | 'perDay' | 'perBooth';

interface InventoryItem {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  quantity: number;
  unitPrice: number;
  pricingModel: PricingModel;
  included: boolean;
  requiredFor: MiceSubType[];
}

interface RoomBlock {
  id: string;
  hotelName: string;
  roomType: string;
  totalRooms: number;
  ratePerNight: number;
  amenities: string[];
}

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  value: string;
  options?: string[];
  required: boolean;
  forType: MiceSubType[];
}

export default function CreateEventPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [eventType, setEventType] = useState<EventType>('MICE');
  const [miceSubType, setMiceSubType] = useState<MiceSubType>('Conferences');
  const [eventName, setEventName] = useState('');
  const [plannerName, setPlannerName] = useState('');
  const [plannerEmail, setPlannerEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // MICE-specific fields
  const [attendeeCount, setAttendeeCount] = useState<string>('');
  const [breakoutRooms, setBreakoutRooms] = useState<string>('');
  const [exhibitionSpace, setExhibitionSpace] = useState<string>('');
  const [incentiveBudget, setIncentiveBudget] = useState<string>('');

  // Custom fields based on sub-type
  const [customFields, setCustomFields] = useState<CustomField[]>([
    // Meetings
    { id: '1', label: 'Number of Breakout Sessions', type: 'number', value: '', forType: ['Meetings'], required: true },
    { id: '2', label: 'Meeting Duration (days)', type: 'number', value: '', forType: ['Meetings'], required: true },
    
    // Incentives
    { id: '3', label: 'Incentive Budget per Person', type: 'number', value: '', forType: ['Incentives'], required: true },
    { id: '4', label: 'Activity Level', type: 'select', value: '', options: ['Low', 'Medium', 'High'], forType: ['Incentives'], required: true },
    
    // Conferences
    { id: '5', label: 'Number of Tracks', type: 'number', value: '', forType: ['Conferences'], required: true },
    { id: '6', label: 'Speaker Count', type: 'number', value: '', forType: ['Conferences'], required: true },
    
    // Exhibitions
    { id: '7', label: 'Exhibition Area (sq ft)', type: 'number', value: '', forType: ['Exhibitions'], required: true },
    { id: '8', label: 'Booth Count', type: 'number', value: '', forType: ['Exhibitions'], required: true },
  ]);

  // Get current sub-type specific fields
  const getCurrentFields = () => {
    return customFields.filter(field => field.forType.includes(miceSubType));
  };

  const updateCustomField = (id: string, value: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  // Inventory & Pricing - with sub-type specific items
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    // Common items
    { id: '1', name: 'Deluxe Room', type: 'hotel', description: 'Ocean view room with king bed', quantity: 20, unitPrice: 250, pricingModel: 'perRoom', included: true, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    { id: '2', name: 'Airport Transfer', type: 'transport', description: 'Round trip airport transfers', quantity: 50, unitPrice: 75, pricingModel: 'perPerson', included: true, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    
    // Meetings specific
    { id: '3', name: 'Audio Visual Package', type: 'av', description: 'Projector, screens, microphones', quantity: 5, unitPrice: 500, pricingModel: 'perDay', included: false, requiredFor: ['Meetings'] },
    { id: '4', name: 'High-Speed Internet', type: 'internet', description: 'Dedicated conference WiFi', quantity: 1, unitPrice: 1000, pricingModel: 'package', included: false, requiredFor: ['Meetings', 'Conferences'] },
    
    // Incentives specific
    { id: '5', name: 'Team Building Activity', type: 'gift', description: 'Full day team building program', quantity: 1, unitPrice: 3000, pricingModel: 'package', included: false, requiredFor: ['Incentives'] },
    { id: '6', name: 'Welcome Gift Package', type: 'gift', description: 'Premium welcome gifts for attendees', quantity: 50, unitPrice: 50, pricingModel: 'perPerson', included: false, requiredFor: ['Incentives'] },
    
    // Conferences specific
    { id: '7', name: 'Speaker Lounge Setup', type: 'av', description: 'VIP speaker lounge with amenities', quantity: 1, unitPrice: 2000, pricingModel: 'package', included: false, requiredFor: ['Conferences'] },
    { id: '8', name: 'Registration Desk', type: 'av', description: 'Conference registration setup', quantity: 2, unitPrice: 800, pricingModel: 'perDay', included: false, requiredFor: ['Conferences'] },
    
    // Exhibitions specific
    { id: '9', name: 'Exhibition Booth', type: 'booth', description: 'Standard 10x10 exhibition booth', quantity: 20, unitPrice: 1200, pricingModel: 'perBooth', included: false, requiredFor: ['Exhibitions'] },
    { id: '10', name: 'Carpet & Draping', type: 'av', description: 'Booth carpet and backdrop draping', quantity: 20, unitPrice: 150, pricingModel: 'perBooth', included: false, requiredFor: ['Exhibitions'] },
  ]);

  // Get filtered inventory items for current sub-type
  const getFilteredInventoryItems = () => {
    return inventoryItems.filter(item => 
      item.requiredFor.includes(miceSubType) || eventType === 'Wedding'
    );
  };

  // Get service options based on event type
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

  // Get pricing model options based on event type
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

  // Room Blocks
  const [roomBlocks, setRoomBlocks] = useState<RoomBlock[]>([
    { id: '1', hotelName: 'Grand Marina Hotel', roomType: 'Deluxe Ocean View', totalRooms: 20, ratePerNight: 250, amenities: ['WiFi', 'Breakfast', 'Pool Access'] },
    { id: '2', hotelName: 'Grand Marina Hotel', roomType: 'Standard Room', totalRooms: 15, ratePerNight: 180, amenities: ['WiFi', 'Breakfast'] },
  ]);

  // Set default event name based on sub-type
  useEffect(() => {
    if (eventType === 'MICE' && !eventName) {
      const today = new Date().getFullYear();
      const baseNames: Record<MiceSubType, string> = {
        'Meetings': 'Annual Corporate Meeting',
        'Incentives': 'Employee Incentive Trip',
        'Conferences': 'Industry Conference',
        'Exhibitions': 'Trade Show Exhibition'
      };
      setEventName(`${baseNames[miceSubType]} ${today}`);
    }
  }, [miceSubType, eventType, eventName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating event:', {
      eventType,
      miceSubType: eventType === 'MICE' ? miceSubType : undefined,
      eventName,
      plannerName,
      plannerEmail,
      startDate,
      endDate,
      location,
      description,
      attendeeCount,
      breakoutRooms,
      exhibitionSpace,
      incentiveBudget,
      customFields: getCurrentFields(),
      inventoryItems: getFilteredInventoryItems().filter(item => item.included),
      roomBlocks,
    });
    
    // In a real app, you would make an API call here
    setTimeout(() => {
      alert('Event created successfully!');
      router.push('/events');
    }, 1000);
  };

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
      requiredFor: [miceSubType],
    };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const removeInventoryItem = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  const updateInventoryItem = (id: string, field: keyof InventoryItem, value: any) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addRoomBlock = () => {
    const newRoomBlock: RoomBlock = {
      id: Date.now().toString(),
      hotelName: '',
      roomType: '',
      totalRooms: 1,
      ratePerNight: 0,
      amenities: [],
    };
    setRoomBlocks([...roomBlocks, newRoomBlock]);
  };

  const removeRoomBlock = (id: string) => {
    setRoomBlocks(roomBlocks.filter(block => block.id !== id));
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

  const getServiceTypeName = (type: ServiceType) => {
    const names = {
      hotel: 'Hotel',
      transport: 'Transport',
      catering: 'Catering',
      av: 'Audio Visual',
      internet: 'Internet',
      booth: 'Exhibition Booth',
      gift: 'Incentives & Gifts',
    };
    return names[type] || type;
  };

  const calculateTotalValue = () => {
    return getFilteredInventoryItems()
      .filter(item => item.included)
      .reduce((total, item) => {
        const itemTotal = item.quantity * item.unitPrice;
        return total + itemTotal;
      }, 0);
  };

  const getMiceSubTypeIcon = (subType: MiceSubType) => {
    switch (subType) {
      case 'Meetings': return <UsersIcon className="h-6 w-6" />;
      case 'Incentives': return <GiftIcon className="h-6 w-6" />;
      case 'Conferences': return <PresentationChartBarIcon className="h-6 w-6" />;
      case 'Exhibitions': return <BuildingStorefrontIcon className="h-6 w-6" />;
      default: return <BuildingOfficeIcon className="h-6 w-6" />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Create New Event
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Set up a new MICE event or destination wedding with custom inventory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className={`h-1 w-20 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center text-sm">
          <div className="w-32 text-center">
            <div className="font-medium">Basic Info</div>
          </div>
          <div className="w-32 text-center">
            <div className="font-medium">Inventory & Pricing</div>
          </div>
          <div className="w-32 text-center">
            <div className="font-medium">Review & Create</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div className="space-y-6">
              {/* Event Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Type
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setEventType('MICE')}
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
                    onClick={() => setEventType('Wedding')}
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
                        onClick={() => setMiceSubType(subType)}
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
                    onChange={(e) => setEventName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder={
                      eventType === 'MICE' 
                        ? `e.g., ${miceSubType === 'Meetings' ? 'Annual Corporate Meeting' : miceSubType === 'Incentives' ? 'Employee Incentive Trip' : miceSubType === 'Conferences' ? 'Industry Conference' : 'Trade Show Exhibition'}`
                        : 'e.g., Smith-Wilson Destination Wedding'
                    }
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
                    onChange={(e) => setLocation(e.target.value)}
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
                    onChange={(e) => setPlannerName(e.target.value)}
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
                    onChange={(e) => setPlannerEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., sarah@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                        onChange={(e) => setAttendeeCount(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 150"
                      />
                    </div>

                    {/* Sub-type specific fields */}
                    {miceSubType === 'Meetings' && (
                      <div>
                        <label htmlFor="breakoutRooms" className="block text-sm font-medium text-gray-700">
                          Breakout Rooms Needed *
                        </label>
                        <input
                          type="number"
                          id="breakoutRooms"
                          required
                          value={breakoutRooms}
                          onChange={(e) => setBreakoutRooms(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., 5"
                        />
                      </div>
                    )}

                    {miceSubType === 'Incentives' && (
                      <div>
                        <label htmlFor="incentiveBudget" className="block text-sm font-medium text-gray-700">
                          Total Incentive Budget *
                        </label>
                        <input
                          type="number"
                          id="incentiveBudget"
                          required
                          value={incentiveBudget}
                          onChange={(e) => setIncentiveBudget(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., 50000"
                        />
                      </div>
                    )}

                    {miceSubType === 'Exhibitions' && (
                      <div>
                        <label htmlFor="exhibitionSpace" className="block text-sm font-medium text-gray-700">
                          Exhibition Space (sq ft) *
                        </label>
                        <input
                          type="number"
                          id="exhibitionSpace"
                          required
                          value={exhibitionSpace}
                          onChange={(e) => setExhibitionSpace(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., 10000"
                        />
                      </div>
                    )}

                    {/* Dynamic custom fields */}
                    {getCurrentFields().map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && '*'}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, e.target.value)}
                            required={field.required}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="" className="text-gray-500">Select an option</option>
                            {field.options?.map(option => (
                              <option key={option} value={option} className="text-gray-900">{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, e.target.value)}
                            required={field.required}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, e.target.value)}
                            required={field.required}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Wedding Specific Fields */}
                {eventType === 'Wedding' && (
                  <div className="col-span-2">
                    <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                      Estimated Guest Count *
                    </label>
                    <input
                      type="number"
                      id="guestCount"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 150"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Brief description of the event..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue to Inventory
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Inventory & Pricing */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Room Blocks */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Room Blocks</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure hotel room allocations for your event
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
                  <div key={block.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Room Block</h3>
                      <button
                        type="button"
                        onClick={() => removeRoomBlock(block.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Hotel Name</label>
                        <input
                          type="text"
                          value={block.hotelName}
                          onChange={(e) => {
                            const newBlocks = roomBlocks.map(b =>
                              b.id === block.id ? { ...b, hotelName: e.target.value } : b
                            );
                            setRoomBlocks(newBlocks);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Hotel name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Room Type</label>
                        <input
                          type="text"
                          value={block.roomType}
                          onChange={(e) => {
                            const newBlocks = roomBlocks.map(b =>
                              b.id === block.id ? { ...b, roomType: e.target.value } : b
                            );
                            setRoomBlocks(newBlocks);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., Deluxe Ocean View"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Total Rooms</label>
                        <input
                          type="number"
                          min="1"
                          value={block.totalRooms}
                          onChange={(e) => {
                            const newBlocks = roomBlocks.map(b =>
                              b.id === block.id ? { ...b, totalRooms: parseInt(e.target.value) || 1 } : b
                            );
                            setRoomBlocks(newBlocks);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Rate per Night ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={block.ratePerNight}
                          onChange={(e) => {
                            const newBlocks = roomBlocks.map(b =>
                              b.id === block.id ? { ...b, ratePerNight: parseFloat(e.target.value) || 0 } : b
                            );
                            setRoomBlocks(newBlocks);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Items */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Inventory & Services</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {eventType === 'MICE' 
                      ? `Configure services for your ${miceSubType.toLowerCase()} event`
                      : 'Configure services for your destination wedding'
                    }
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
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          item.requiredFor.includes(miceSubType) ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {getServiceIcon(item.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)}
                              className="border-0 bg-transparent p-0 text-sm font-medium text-gray-900 focus:ring-0"
                              placeholder="Service name"
                            />
                            <select
                              value={item.type}
                              onChange={(e) => updateInventoryItem(item.id, 'type', e.target.value as ServiceType)}
                              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              {getServiceOptions().map((option) => (
                                <option key={option.value} value={option.value} className="text-gray-900">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateInventoryItem(item.id, 'description', e.target.value)}
                            className="mt-1 w-full border-0 bg-transparent p-0 text-sm text-gray-900 focus:ring-0"
                            placeholder="Service description"
                          />
                          {item.requiredFor.includes(miceSubType) && (
                            <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              Recommended for {miceSubType}
                            </span>
                          )}
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
                          <span className="ml-2 text-sm text-gray-600">Include</span>
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInventoryItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Pricing Model</label>
                        <select
                          value={item.pricingModel}
                          onChange={(e) => updateInventoryItem(item.id, 'pricingModel', e.target.value as PricingModel)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        >
                          {getPricingModelOptions().map((option) => (
                            <option key={option.value} value={option.value} className="text-gray-900">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-xs font-medium text-gray-500">Total Value</label>
                          <div className="mt-1 text-lg font-medium text-gray-900">
                            ${(item.quantity * item.unitPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Value Summary */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <InformationCircleIcon className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Total estimated value of included services:</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${calculateTotalValue().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Review & Create
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-medium text-gray-900">Review & Create</h2>
              
              {/* Event Summary */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Event Summary</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Event Name</label>
                      <p className="text-sm font-medium text-gray-900">{eventName || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Event Type</label>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          eventType === 'MICE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
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
                      <label className="block text-xs font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900">{location || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Dates</label>
                      <p className="text-sm text-gray-900">
                        {startDate && endDate ? `${startDate} to ${endDate}` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Planner</label>
                      <p className="text-sm text-gray-900">{plannerName || 'Not specified'}</p>
                      <p className="text-xs text-gray-500">{plannerEmail || 'No email provided'}</p>
                    </div>
                    {eventType === 'MICE' && attendeeCount && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Estimated Attendees</label>
                        <p className="text-sm text-gray-900">{attendeeCount}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Total Inventory Value</label>
                      <p className="text-lg font-semibold text-gray-900">
                        ${calculateTotalValue().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom Fields Summary */}
                {eventType === 'MICE' && getCurrentFields().some(field => field.value) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{miceSubType} Specific Details</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {getCurrentFields()
                        .filter(field => field.value)
                        .map((field) => (
                          <div key={field.id}>
                            <label className="block text-xs font-medium text-gray-500">{field.label}</label>
                            <p className="text-sm text-gray-900">{field.value}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Included Services */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Included Services</h3>
                <div className="space-y-3">
                  {getFilteredInventoryItems()
                    .filter(item => item.included)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center space-x-3">
                          {getServiceIcon(item.type)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                            <span className="inline-block mt-1 text-xs font-medium text-gray-400">
                              {getServiceTypeName(item.type)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.quantity * item.unitPrice).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ${item.unitPrice} ({item.pricingModel})
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Room Blocks */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Room Blocks</h3>
                <div className="space-y-3">
                  {roomBlocks.map((block) => (
                    <div key={block.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{block.hotelName}</p>
                          <p className="text-xs text-gray-500">{block.roomType}</p>
                          {block.amenities.length > 0 && (
                            <div className="mt-1">
                              {block.amenities.map(amenity => (
                                <span key={amenity} className="inline-block mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {block.totalRooms} rooms × ${block.ratePerNight}/night
                          </p>
                          <p className="text-xs text-gray-500">
                            Total: ${(block.totalRooms * block.ratePerNight).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-8">
                <div className="rounded-lg bg-gray-50 p-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      I confirm that all information provided is accurate and I agree to the terms of service.
                      {eventType === 'MICE' 
                        ? ` The ${miceSubType.toLowerCase()} will be created with unique planner and guest links.`
                        : ' The wedding event will be created with unique planner and guest links.'
                      }
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Back to Inventory
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}