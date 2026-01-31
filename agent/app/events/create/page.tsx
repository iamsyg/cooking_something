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

import { useDispatch, useSelector } from 'react-redux';
import { updateBasicDetails, setCustomFields, setRoomBlocks, setInventoryItems, setPackages, setItinerary, updateMicrositeConfig } from '@/store/slices/createEventSlice';
import { MicrositeConfig, ItineraryDay, updateCustomField } from '@/store/slices/createEventSlice';
import { RootState } from '@/store/store';
import { CUSTOM_FIELDS_CONFIG } from '@/config/customFields';

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const state = useSelector((state: RootState) => state.createEvent);

  const {
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
    roomBlocks,
    inventoryItems,
    packages,
    itinerary,
    micrositeConfig,
    customFields
  } = state;

  // Auto-set booking end date when start date changes
  useEffect(() => {
    if (!startDate || roomBlocks.length === 0) return;

    const eventStart = new Date(startDate);
    const releaseDate = new Date(eventStart);
    releaseDate.setDate(releaseDate.getDate() - 7);
    const releaseDateStr = releaseDate.toISOString().split('T')[0];

    const needsUpdate = roomBlocks.some(
      block => block.releaseDate !== releaseDateStr
    );

    if (!needsUpdate) return;

    dispatch(
      setRoomBlocks(
        roomBlocks.map(block => ({
          ...block,
          releaseDate: releaseDateStr
        }))
      )
    );
  }, [startDate, roomBlocks, dispatch]);


  // Auto-generate welcome message
  useEffect(() => {
    if (eventType === 'MICE' && eventName) {

      dispatch(updateBasicDetails({
        micrositeConfig: {
          ...micrositeConfig,
          welcomeMessage: `Welcome to ${eventName}! We're excited to have you join us for this ${miceSubType?.toLowerCase()} event.`
        }
      }));
    } else if (eventType === 'Wedding' && eventName) {
      dispatch(updateBasicDetails({
        micrositeConfig: {
          ...micrositeConfig,
          welcomeMessage: `Welcome to ${eventName}! We're thrilled to celebrate with you.`
        }
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

      dispatch(setItinerary(newItinerary));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!startDate || bookingStartDate) return;

    dispatch(updateBasicDetails({
      bookingStartDate: new Date().toISOString().split('T')[0]
    }));
  }, [startDate, bookingStartDate, dispatch]);

  useEffect(() => {
    console.log('UPDATED inventory state:', {
      roomBlocks,
      inventoryItems,
      packages
    });
  }, [roomBlocks, inventoryItems, packages]);

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
                miceSubType={miceSubType!}
                eventName={eventName}
                location={location}
                plannerName={plannerName}
                plannerEmail={plannerEmail}
                startDate={startDate}
                endDate={endDate}
                description={description ? description : ''}
                attendeeCount={attendeeCount ? attendeeCount : ''}
                bookingStartDate={bookingStartDate ? bookingStartDate : ''}
                bookingEndDate={bookingEndDate ? bookingEndDate : ''}
                customFields={customFields}

                onCustomFieldChange={(id, value) =>
                  dispatch(updateCustomField({ id, data: { value } }))
                }

                onEventTypeChange={(type) =>
                  dispatch(updateBasicDetails({ eventType: type }))
                }

                onMiceSubTypeChange={(subType) => {
                  dispatch(updateBasicDetails({ miceSubType: subType }));

                  if (customFields.length === 0) {
                    dispatch(
                      setCustomFields(
                        CUSTOM_FIELDS_CONFIG[subType].map(field => ({
                          ...field,
                          value: ''
                        }))
                      )
                    );
                  }
                }}

                onEventNameChange={(v) => dispatch(updateBasicDetails({ eventName: v }))}
                onLocationChange={(v) => dispatch(updateBasicDetails({ location: v }))}
                onPlannerNameChange={(v) => dispatch(updateBasicDetails({ plannerName: v }))}
                onPlannerEmailChange={(v) => dispatch(updateBasicDetails({ plannerEmail: v }))}
                onStartDateChange={(v) => dispatch(updateBasicDetails({ startDate: v }))}
                onEndDateChange={(v) => dispatch(updateBasicDetails({ endDate: v }))}
                onDescriptionChange={(v) => dispatch(updateBasicDetails({ description: v }))}
                onAttendeeCountChange={(v) => dispatch(updateBasicDetails({ attendeeCount: v }))}
                onBookingStartDateChange={(v) =>
                  dispatch(updateBasicDetails({ bookingStartDate: v }))
                }
                onBookingEndDateChange={(v) =>
                  dispatch(updateBasicDetails({ bookingEndDate: v }))
                }
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


                    dispatch(updateBasicDetails({
                      attendeeCount,
                    }))

                    console.log('Dispatched basic details to store');
                    console.log('Current store state:', {
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
                    });

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

                onRoomBlocksChange={(blocks) => dispatch(setRoomBlocks(blocks))}
                onInventoryItemsChange={(items) => dispatch(setInventoryItems(items))}
                onPackagesChange={(pkgs) => dispatch(setPackages(pkgs))}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                  }}
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
                  dispatch(setItinerary(updatedItinerary));
                }}
                onMicrositeConfigChange={(updatedConfig) => {
                  // setMicrositeConfig(updatedConfig);
                  dispatch(updateMicrositeConfig(updatedConfig));
                }}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {

                    setStep(2)
                  }}
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