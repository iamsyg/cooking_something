// app/events/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import ProgressSteps from '@/components/ProgressSteps';
import CreateEventStepOne from '@/components/CreateEventStepOne';
import CreateEventStepTwo from '@/components/CreateEventStepTwo';
import CreateEventStepThree from '@/components/CreateEventStepThree';
import CreateEventStepFour from '@/components/CreateEventStepFour';

import type { EventType, MiceSubType, InventoryItem, Package, RoomBlock } from '@/types/event';

import { useDispatch, useSelector } from 'react-redux';
import { updateBasicDetails, setCustomFields } from '@/store/slices/createEventSlice';
import { MicrositeConfig, ItineraryDay } from '@/store/slices/createEventSlice';
import { RootState } from '@/store/store';

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useDispatch();

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
  const [attendeeCount, setAttendeeCount] = useState<string>('');
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');

  // Initialize inventory items, packages, and room blocks
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

  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: 'Standard Package',
      description: 'Room + Breakfast + Airport Transfer',
      basePrice: 350,
      includedServices: ['1', '2', '3'],
      optionalUpgrades: ['4', '5'],
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

  const [roomBlocks, setRoomBlocks] = useState<RoomBlock[]>([
    {
      id: '1',
      hotelName: 'Grand Marina Hotel',
      roomType: 'Deluxe Ocean View',
      totalRooms: 20,
      ratePerNight: 250,
      amenities: ['WiFi', 'Breakfast', 'Pool Access'],
      locked: true,
      releaseDate: ''
    },
  ]);

  // Microsite Configuration
  const [micrositeConfig, setMicrositeConfig] = useState<MicrositeConfig>({
    themeLogoUrl: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#EC4899',
    welcomeMessage: '',
    showItinerary: true,
    showPackages: true,
    customDomain: ''
  });

  // Itinerary
  // const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  const itinerary = useSelector(
    (state: RootState) => state.createEvent.itinerary
  );

  // Auto-set booking end date when start date changes
  useEffect(() => {
    if (startDate) {
      const eventStart = new Date(startDate);
      const sevenDaysBefore = new Date(eventStart);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
      const releaseDateStr = sevenDaysBefore.toISOString().split('T')[0];

      // Update room blocks with release date
      setRoomBlocks(prev => prev.map(block => ({
        ...block,
        releaseDate: releaseDateStr
      })));

      // Set booking end date
      setBookingEndDate(releaseDateStr);
    }
  }, [startDate]);

  // Auto-generate event name
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
  }, [miceSubType, eventType]);

  // Auto-generate welcome message
  useEffect(() => {
    if (eventType === 'MICE' && eventName) {
      setMicrositeConfig(prev => ({
        ...prev,
        welcomeMessage: `Welcome to ${eventName}! We're excited to have you join us for this ${miceSubType.toLowerCase()} event.`
      }));
    } else if (eventType === 'Wedding' && eventName) {
      setMicrositeConfig(prev => ({
        ...prev,
        welcomeMessage: `Welcome to ${eventName}! We're thrilled to celebrate with you.`
      }));
    }
  }, [eventType, miceSubType]);

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

      // setItinerary(newItinerary);
      dispatch(updateBasicDetails({
        itinerary: newItinerary
      }))
    }
  }, [startDate, endDate]);

  if (startDate && !bookingStartDate) {
    setBookingStartDate(new Date().toISOString().split('T')[0]);
  }

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
      bookingEndDate,
      inventoryItems,
      packages,
      roomBlocks,
      micrositeConfig,
      itinerary
    });

    alert('Event created successfully! Generating planner and guest links...');
    router.push('/events');
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

        <ProgressSteps step={step} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-medium text-gray-900">Basic Information</h2>

              <CreateEventStepOne
                eventType={eventType}
                miceSubType={miceSubType}
                eventName={eventName}
                location={location}
                plannerName={plannerName}
                plannerEmail={plannerEmail}
                startDate={startDate}
                endDate={endDate}
                description={description}
                attendeeCount={attendeeCount}
                bookingStartDate={bookingStartDate}
                bookingEndDate={bookingEndDate}
                onEventTypeChange={setEventType}
                onMiceSubTypeChange={setMiceSubType}
                onEventNameChange={setEventName}
                onLocationChange={setLocation}
                onPlannerNameChange={setPlannerName}
                onPlannerEmailChange={setPlannerEmail}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onDescriptionChange={setDescription}
                onAttendeeCountChange={setAttendeeCount}
                onBookingStartDateChange={setBookingStartDate}
                onBookingEndDateChange={setBookingEndDate}
              />

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                    onClick={() => {
                      dispatch(updateBasicDetails({
                        eventType,
                        miceSubType: eventType === 'MICE' ? miceSubType : undefined,
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
                      }))

                      if (eventType === 'MICE') {
                        if(miceSubType === 'Meetings') {
                          dispatch(setCustomFields([
                            { id: '1', label: 'NumberOfBreakOutSessions', type: 'number', options: [], value: '', required: false, forType: ['Meetings'] },
                            { id: '2', label: 'MeetingDuration', type: 'number', options: [], value: '', required: false, forType: ['Meetings'] },
                          ]));
                        }

                        else if(miceSubType === 'Incentives') {
                          dispatch(setCustomFields([
                            { id: '3', label: 'IncentiveBudgetPerPerson', type: 'number', options: [], value: '', required: false, forType: ['Incentives'] },
                            { id: '4', label: 'ActivityLevel', type: 'select', options: [], value: '', required: false, forType: ['Incentives'] },
                          ]));
                        }

                        else if(miceSubType === 'Conferences') {
                          dispatch(setCustomFields([
                            { id: '5', label: 'NumberOfTracks', type: 'number', options: [], value: '',  required: false, forType: ['Conferences'] },
                            { id: '6', label: 'SpeakerCount', type: 'number', options: [], value: '', required: false, forType: ['Conferences'] },
                          ]));
                        }

                        else if(miceSubType === 'Exhibitions') {
                          dispatch(setCustomFields([
                            { id: '7', label: 'ExhibitionArea', type: 'number', options: [], value: '', required: false, forType: ['Exhibitions'] },
                            { id: '8', label: 'BoothCount', type: 'number', options: [], value: '', required: false, forType: ['Exhibitions'] },
                          ]));
                        }
                      }

                      else {
                        dispatch(updateBasicDetails({
                          attendeeCount,
                        }))
                      }
                        
                      setStep(2);
                    }
                  }
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Continue to Inventory
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Inventory & Packages */}
          {step === 2 && (
            <div className="space-y-6">
              <CreateEventStepTwo
                bookingEndDate={bookingEndDate}
                eventType={eventType}
                miceSubType={miceSubType}
                roomBlocks={roomBlocks}
                inventoryItems={inventoryItems}
                packages={packages}
                onRoomBlocksChange={setRoomBlocks}
                onInventoryItemsChange={setInventoryItems}
                onPackagesChange={setPackages}
              />

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

          {/* Step 3: Microsite Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <CreateEventStepThree
                eventName={eventName}
                eventType={eventType}
                miceSubType={miceSubType}
                itinerary={itinerary}
                micrositeConfig={micrositeConfig}
                onItineraryChange={(updatedItinerary) => {
                  // setItinerary(updatedItinerary);
                  dispatch(updateBasicDetails({
                    itinerary: updatedItinerary
                  }))
                }}
                onMicrositeConfigChange={setMicrositeConfig}
              />

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

          {/* Step 4: Review & Create */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-medium text-gray-900">Review & Create</h2>

                <CreateEventStepFour
                  eventType={eventType}
                  miceSubType={miceSubType}
                  eventName={eventName}
                  location={location}
                  plannerName={plannerName}
                  plannerEmail={plannerEmail}
                  startDate={startDate}
                  endDate={endDate}
                  description={description}
                  attendeeCount={attendeeCount}
                  bookingEndDate={bookingEndDate}
                  roomBlocks={roomBlocks}
                  inventoryItems={inventoryItems}
                  packages={packages}
                  micrositeConfig={micrositeConfig}
                  itinerary={itinerary}
                />

                <div className="mt-8 flex items-center justify-between">
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