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
  BuildingStorefrontIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PhotoIcon,
  ClipboardDocumentCheckIcon
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
  isOptionalUpgrade: boolean; // NEW: Mark as optional upgrade
  upgradePrice?: number; // NEW: Additional cost for upgrade
  requiredFor: MiceSubType[];
}

interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  includedServices: string[]; // Array of inventory item IDs
  optionalUpgrades: string[]; // Array of optional service IDs
  isDefault: boolean;
}

interface RoomBlock {
  id: string;
  hotelName: string;
  roomType: string;
  totalRooms: number;
  ratePerNight: number;
  amenities: string[];
  locked: boolean; // NEW: Inventory locking status
  releaseDate?: string; // NEW: Auto-release date for unused rooms
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

export default function CreateEventPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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

  // Custom fields based on sub-type
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', label: 'Number of Breakout Sessions', type: 'number', value: '', forType: ['Meetings'], required: true },
    { id: '2', label: 'Meeting Duration (days)', type: 'number', value: '', forType: ['Meetings'], required: true },
    { id: '3', label: 'Incentive Budget per Person', type: 'number', value: '', forType: ['Incentives'], required: true },
    { id: '4', label: 'Activity Level', type: 'select', value: '', options: ['Low', 'Medium', 'High'], forType: ['Incentives'], required: true },
    { id: '5', label: 'Number of Tracks', type: 'number', value: '', forType: ['Conferences'], required: true },
    { id: '6', label: 'Speaker Count', type: 'number', value: '', forType: ['Conferences'], required: true },
    { id: '7', label: 'Exhibition Area (sq ft)', type: 'number', value: '', forType: ['Exhibitions'], required: true },
    { id: '8', label: 'Booth Count', type: 'number', value: '', forType: ['Exhibitions'], required: true },
  ]);

  const getCurrentFields = () => {
    return customFields.filter(field => field.forType.includes(miceSubType));
  };

  const updateCustomField = (id: string, value: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  // Inventory & Pricing
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Deluxe Room', type: 'hotel', description: 'Ocean view room with king bed', quantity: 20, unitPrice: 250, pricingModel: 'perRoom', included: true, isOptionalUpgrade: false, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    { id: '2', name: 'Airport Transfer', type: 'transport', description: 'Round trip airport transfers', quantity: 50, unitPrice: 75, pricingModel: 'perPerson', included: true, isOptionalUpgrade: false, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    { id: '3', name: 'Breakfast Buffet', type: 'catering', description: 'Daily breakfast buffet', quantity: 50, unitPrice: 25, pricingModel: 'perPerson', included: true, isOptionalUpgrade: false, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    { id: '4', name: 'Premium Room Upgrade', type: 'hotel', description: 'Upgrade to suite with balcony', quantity: 10, unitPrice: 100, pricingModel: 'perRoom', included: false, isOptionalUpgrade: true, upgradePrice: 100, requiredFor: ['Meetings', 'Incentives', 'Conferences', 'Exhibitions'] },
    { id: '5', name: 'Spa Package', type: 'gift', description: '60-minute massage and spa access', quantity: 30, unitPrice: 150, pricingModel: 'perPerson', included: false, isOptionalUpgrade: true, upgradePrice: 150, requiredFor: ['Incentives'] },
    { id: '6', name: 'Audio Visual Package', type: 'av', description: 'Projector, screens, microphones', quantity: 5, unitPrice: 500, pricingModel: 'perDay', included: false, isOptionalUpgrade: false, requiredFor: ['Meetings', 'Conferences'] },
    { id: '7', name: 'High-Speed Internet', type: 'internet', description: 'Dedicated conference WiFi', quantity: 1, unitPrice: 1000, pricingModel: 'package', included: true, isOptionalUpgrade: false, requiredFor: ['Meetings', 'Conferences'] },
    { id: '8', name: 'Exhibition Booth', type: 'booth', description: 'Standard 10x10 exhibition booth', quantity: 20, unitPrice: 1200, pricingModel: 'perBooth', included: false, isOptionalUpgrade: false, requiredFor: ['Exhibitions'] },
  ]);

  // NEW: Package Configuration
  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: 'Standard Package',
      description: 'Room + Breakfast + Airport Transfer',
      basePrice: 350,
      includedServices: ['1', '2', '3'], // Deluxe Room, Airport Transfer, Breakfast
      optionalUpgrades: ['4', '5'], // Premium Room, Spa
      isDefault: true
    },
    {
      id: '2',
      name: 'Premium Package',
      description: 'All Standard amenities + Room Upgrade + Spa',
      basePrice: 600,
      includedServices: ['1', '2', '3', '4', '5'],
      optionalUpgrades: [],
      isDefault: false
    }
  ]);

  // Room Blocks with locking
  const [roomBlocks, setRoomBlocks] = useState<RoomBlock[]>([
    { 
      id: '1', 
      hotelName: 'Grand Marina Hotel', 
      roomType: 'Deluxe Ocean View', 
      totalRooms: 20, 
      ratePerNight: 250, 
      amenities: ['WiFi', 'Breakfast', 'Pool Access'],
      locked: true, // Inventory is locked
      releaseDate: '' // Will be set based on event date
    },
  ]);

  // NEW: Microsite Configuration
  const [micrositeConfig, setMicrositeConfig] = useState<MicrositeConfig>({
    themeLogo: null,
    primaryColor: '#4F46E5', // Indigo
    secondaryColor: '#EC4899', // Pink
    welcomeMessage: '',
    showItinerary: true,
    showPackages: true,
    customDomain: ''
  });

  // NEW: Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  // NEW: Booking validity period
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');

  // Auto-set booking validity and release date
  useEffect(() => {
    if (startDate) {
      const eventStart = new Date(startDate);
      const sevenDaysBefore = new Date(eventStart);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
      
      // Set release date for room blocks
      const releaseDateStr = sevenDaysBefore.toISOString().split('T')[0];
      setRoomBlocks(roomBlocks.map(block => ({
        ...block,
        releaseDate: releaseDateStr
      })));
      
      // Set booking end date (7 days before event)
      setBookingEndDate(releaseDateStr);
    }
  }, [startDate]);

  const getFilteredInventoryItems = () => {
    return inventoryItems.filter(item => 
      item.requiredFor.includes(miceSubType) || eventType === 'Wedding'
    );
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
    
    // Auto-generate welcome message
    if (eventType === 'MICE') {
      setMicrositeConfig(prev => ({
        ...prev,
        welcomeMessage: `Welcome to ${eventName || 'our event'}! We're excited to have you join us for this ${miceSubType.toLowerCase()} event.`
      }));
    } else {
      setMicrositeConfig(prev => ({
        ...prev,
        welcomeMessage: `Welcome to our special day! We're thrilled to celebrate with you.`
      }));
    }
  }, [miceSubType, eventType, eventName]);

  // Generate sample itinerary based on event dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const newItinerary: ItineraryDay[] = [];
      for (let i = 0; i < dayCount; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        newItinerary.push({
          id: `day-${i + 1}`,
          day: i + 1,
          date: currentDate.toISOString().split('T')[0],
          title: `Day ${i + 1}`,
          activities: []
        });
      }
      
      setItinerary(newItinerary);
    }
  }, [startDate, endDate]);

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
      customFields: getCurrentFields(),
      inventoryItems: getFilteredInventoryItems().filter(item => item.included),
      packages,
      roomBlocks,
      micrositeConfig,
      itinerary,
      bookingValidity: { start: bookingStartDate, end: bookingEndDate }
    });
    
    alert('Event created successfully! Generating planner and guest links...');
    router.push('/events');
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
      isOptionalUpgrade: false,
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
    const releaseDate = bookingEndDate || '';
    const newRoomBlock: RoomBlock = {
      id: Date.now().toString(),
      hotelName: '',
      roomType: '',
      totalRooms: 1,
      ratePerNight: 0,
      amenities: [],
      locked: true,
      releaseDate
    };
    setRoomBlocks([...roomBlocks, newRoomBlock]);
  };

  const removeRoomBlock = (id: string) => {
    setRoomBlocks(roomBlocks.filter(block => block.id !== id));
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: '',
      description: '',
      basePrice: 0,
      includedServices: [],
      optionalUpgrades: [],
      isDefault: false
    };
    setPackages([...packages, newPackage]);
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const addItineraryActivity = (dayId: string) => {
    const newActivity: ItineraryActivity = {
      id: Date.now().toString(),
      time: '09:00',
      title: '',
      description: '',
      location: ''
    };
    
    setItinerary(itinerary.map(day => 
      day.id === dayId 
        ? { ...day, activities: [...day.activities, newActivity] }
        : day
    ));
  };

  const removeItineraryActivity = (dayId: string, activityId: string) => {
    setItinerary(itinerary.map(day => 
      day.id === dayId 
        ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
        : day
    ));
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
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

        {/* Progress Steps - NOW 4 STEPS */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <div className={`h-1 w-16 ${step >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                4
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center text-sm gap-4">
            <div className="w-24 text-center">
              <div className="font-medium">Basic Info</div>
            </div>
            <div className="w-24 text-center">
              <div className="font-medium">Inventory</div>
            </div>
            <div className="w-24 text-center">
              <div className="font-medium">Microsite</div>
            </div>
            <div className="w-24 text-center">
              <div className="font-medium">Review</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information - SAME AS BEFORE */}
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
                      onChange={(e) => setStartDate(e.target.value)}
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
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  {eventType === 'MICE' && (
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
                  )}

                  {/* Booking Validity Period */}
                  <div>
                    <label htmlFor="bookingEndDate" className="block text-sm font-medium text-gray-700">
                      Booking Window Closes On
                    </label>
                    <input
                      type="date"
                      id="bookingEndDate"
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Guests can book until this date (defaults to 7 days before event)</p>
                  </div>

                  {/* Custom fields for MICE sub-types */}
                  {eventType === 'MICE' && getCurrentFields().map((field) => (
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
                          <option value="">Select...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
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
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Brief description..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Continue to Inventory
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Inventory & Packages (IMPROVED) */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Room Blocks with Locking */}
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
                            onChange={(e) => {
                              const newBlocks = roomBlocks.map(b =>
                                b.id === block.id ? { ...b, hotelName: e.target.value } : b
                              );
                              setRoomBlocks(newBlocks);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Room Type *</label>
                          <input
                            type="text"
                            required
                            value={block.roomType}
                            onChange={(e) => {
                              const newBlocks = roomBlocks.map(b =>
                                b.id === block.id ? { ...b, roomType: e.target.value } : b
                              );
                              setRoomBlocks(newBlocks);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Rooms Blocked *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={block.totalRooms}
                            onChange={(e) => {
                              const newBlocks = roomBlocks.map(b =>
                                b.id === block.id ? { ...b, totalRooms: parseInt(e.target.value) || 1 } : b
                              );
                              setRoomBlocks(newBlocks);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                            onChange={(e) => {
                              const newBlocks = roomBlocks.map(b =>
                                b.id === block.id ? { ...b, ratePerNight: parseFloat(e.target.value) || 0 } : b
                              );
                              setRoomBlocks(newBlocks);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Release Date</label>
                          <input
                            type="date"
                            value={block.releaseDate || ''}
                            onChange={(e) => {
                              const newBlocks = roomBlocks.map(b =>
                                b.id === block.id ? { ...b, releaseDate: e.target.value } : b
                              );
                              setRoomBlocks(newBlocks);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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

              {/* Inventory Items with Upgrade Options */}
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
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                            />
                            <span className="ml-2 text-sm text-gray-600">Include in base</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.isOptionalUpgrade}
                              onChange={(e) => updateInventoryItem(item.id, 'isOptionalUpgrade', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Pricing Model</label>
                          <select
                            value={item.pricingModel}
                            onChange={(e) => updateInventoryItem(item.id, 'pricingModel', e.target.value as PricingModel)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                            ${(item.quantity * item.unitPrice).toLocaleString()}
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

              {/* Package Builder (NEW) */}
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
                  {packages.map((pkg, index) => (
                    <div key={pkg.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={pkg.name}
                            onChange={(e) => {
                              const newPackages = packages.map(p =>
                                p.id === pkg.id ? { ...p, name: e.target.value } : p
                              );
                              setPackages(newPackages);
                            }}
                            className="font-medium text-gray-900 bg-transparent border-0 focus:ring-0"
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
                              onChange={(e) => {
                                const newPackages = packages.map(p =>
                                  p.id === pkg.id ? { ...p, isDefault: e.target.checked } : { ...p, isDefault: false }
                                );
                                setPackages(newPackages);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
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
                          onChange={(e) => {
                            const newPackages = packages.map(p =>
                              p.id === pkg.id ? { ...p, description: e.target.value } : p
                            );
                            setPackages(newPackages);
                          }}
                          rows={2}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                            onChange={(e) => {
                              const newPackages = packages.map(p =>
                                p.id === pkg.id ? { ...p, basePrice: parseFloat(e.target.value) || 0 } : p
                              );
                              setPackages(newPackages);
                            }}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Continue to Microsite Setup
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Microsite Configuration (NEW) */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Branding */}
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
                          onChange={(e) => setMicrositeConfig({...micrositeConfig, primaryColor: e.target.value})}
                          className="h-10 w-20 rounded-md border border-gray-300"
                        />
                        <input
                          type="text"
                          value={micrositeConfig.primaryColor}
                          onChange={(e) => setMicrositeConfig({...micrositeConfig, primaryColor: e.target.value})}
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
                          onChange={(e) => setMicrositeConfig({...micrositeConfig, secondaryColor: e.target.value})}
                          className="h-10 w-20 rounded-md border border-gray-300"
                        />
                        <input
                          type="text"
                          value={micrositeConfig.secondaryColor}
                          onChange={(e) => setMicrositeConfig({...micrositeConfig, secondaryColor: e.target.value})}
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
                      onChange={(e) => setMicrositeConfig({...micrositeConfig, welcomeMessage: e.target.value})}
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
                        onChange={(e) => setMicrositeConfig({...micrositeConfig, showItinerary: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show event itinerary to guests</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={micrositeConfig.showPackages}
                        onChange={(e) => setMicrositeConfig({...micrositeConfig, showPackages: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow guests to select packages</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Itinerary Builder */}
              {micrositeConfig.showItinerary && (
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
                                onChange={(e) => {
                                  const newItinerary = itinerary.map(d =>
                                    d.id === day.id ? { ...d, title: e.target.value } : d
                                  );
                                  setItinerary(newItinerary);
                                }}
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
                                onChange={(e) => {
                                  const newItinerary = itinerary.map(d =>
                                    d.id === day.id
                                      ? {
                                          ...d,
                                          activities: d.activities.map(a =>
                                            a.id === activity.id ? { ...a, time: e.target.value } : a
                                          ),
                                        }
                                      : d
                                  );
                                  setItinerary(newItinerary);
                                }}
                                className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                              />
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={activity.title}
                                  onChange={(e) => {
                                    const newItinerary = itinerary.map(d =>
                                      d.id === day.id
                                        ? {
                                            ...d,
                                            activities: d.activities.map(a =>
                                              a.id === activity.id ? { ...a, title: e.target.value } : a
                                            ),
                                          }
                                        : d
                                    );
                                    setItinerary(newItinerary);
                                  }}
                                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                  placeholder="Activity title"
                                />
                                <input
                                  type="text"
                                  value={activity.description}
                                  onChange={(e) => {
                                    const newItinerary = itinerary.map(d =>
                                      d.id === day.id
                                        ? {
                                            ...d,
                                            activities: d.activities.map(a =>
                                              a.id === activity.id ? { ...a, description: e.target.value } : a
                                            ),
                                          }
                                        : d
                                    );
                                    setItinerary(newItinerary);
                                  }}
                                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                  placeholder="Description"
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
                              No activities scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Review & Create Event
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Create (IMPROVED) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-medium text-gray-900">Review & Create</h2>
                
                {/* Event Summary */}
                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Event Details</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Event Name</label>
                        <p className="text-sm font-medium text-gray-900">{eventName}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Type</label>
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
                        <label className="block text-xs font-medium text-gray-500">Dates</label>
                        <p className="text-sm text-gray-900">{startDate} to {endDate}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Location</label>
                        <p className="text-sm text-gray-900">{location}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Planner</label>
                        <p className="text-sm text-gray-900">{plannerName}</p>
                        <p className="text-xs text-gray-500">{plannerEmail}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Booking Window</label>
                        <p className="text-sm text-gray-900">Closes on {bookingEndDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Blocks Summary */}
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
                            {block.totalRooms} rooms blocked · Releases {block.releaseDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${block.ratePerNight}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packages Summary */}
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
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{micrositeConfig.welcomeMessage}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {micrositeConfig.showItinerary && <span>✓ Itinerary visible</span>}
                      {micrositeConfig.showPackages && <span>✓ Package selection enabled</span>}
                      <span>✓ {itinerary.reduce((acc, day) => acc + day.activities.length, 0)} activities scheduled</span>
                    </div>
                  </div>
                </div>

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
                          <li>Guests can book until {bookingEndDate}, then unused rooms auto-release</li>
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
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600"
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      I confirm all information is accurate. I understand that inventory will be locked, links will be generated,
                      and this event will go live immediately upon creation.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    Create Event & Generate Links
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}