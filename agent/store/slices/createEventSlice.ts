// agent/store/slices/createEventSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
    EventType,
    MiceSubType,
    InventoryItem,
    Package,
    RoomBlock,
    CustomField
} from '@/types/event';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface MicrositeConfig {
    themeLogo?: File | null;
    primaryColor: string;
    secondaryColor: string;
    welcomeMessage: string;
    showItinerary: boolean;
    showPackages: boolean;
    customDomain?: string;
}

interface ItineraryActivity {
    id: string;
    time: string;
    title: string;
    description: string;
    location?: string;
}

interface ItineraryDay {
    id: string;
    day: number;
    date: string;
    title: string;
    activities: ItineraryActivity[];
}

interface CreateEventState {
    /* Step 1 (minimal but useful for step 4) */
    eventName: string;
    eventType: EventType;
    miceSubType?: MiceSubType;
    location: string;
    plannerName: string;
    plannerEmail: string;
    startDate: string;
    endDate: string;
    bookingStartDate?: string;
    bookingEndDate: string;
    attendeeCount?: string;
    description?: string;

    /* Step 2 */
    roomBlocks: RoomBlock[];
    inventoryItems: InventoryItem[];
    packages: Package[];

    /* Step 3 */
    micrositeConfig: MicrositeConfig;
    itinerary: ItineraryDay[];

    /* STEP 3 – Registration / Custom Fields */
    customFields: CustomField[];
}

/* ------------------------------------------------------------------ */
/* Initial State                                                       */
/* ------------------------------------------------------------------ */

const initialState: CreateEventState = {
    eventName: '',
    eventType: 'MICE',
    miceSubType: 'Conferences',
    location: '',
    plannerName: '',
    plannerEmail: '',
    startDate: '',
    endDate: '',
    bookingStartDate: '',
    bookingEndDate: '',
    attendeeCount: '',
    description: '',

    roomBlocks: [],
    inventoryItems: [],
    packages: [],

    micrositeConfig: {
        primaryColor: '#4F46E5',
        secondaryColor: '#EC4899',
        welcomeMessage: '',
        showItinerary: true,
        showPackages: true,
        customDomain: '',
        themeLogo: null,
    },

    itinerary: [],

    customFields: [],
};

/* ------------------------------------------------------------------ */
/* Slice                                                               */
/* ------------------------------------------------------------------ */

const createEventSlice = createSlice({
    name: 'createEvent',
    initialState,
    reducers: {
        /* =======================
           STEP 1
        ======================= */

        updateBasicDetails(
            state,
            action: PayloadAction<Partial<CreateEventState>>
        ) {
            Object.assign(state, action.payload);
        },

        /* =======================
           STEP 2 – Room Blocks
        ======================= */

        setRoomBlocks(state, action: PayloadAction<RoomBlock[]>) {
            state.roomBlocks = action.payload;
        },

        addRoomBlock(state, action: PayloadAction<RoomBlock>) {
            state.roomBlocks.push(action.payload);
        },

        updateRoomBlock(
            state,
            action: PayloadAction<{ id: string; data: Partial<RoomBlock> }>
        ) {
            const block = state.roomBlocks.find(b => b.id === action.payload.id);
            if (block) Object.assign(block, action.payload.data);
        },

        removeRoomBlock(state, action: PayloadAction<string>) {
            state.roomBlocks = state.roomBlocks.filter(
                block => block.id !== action.payload
            );
        },

        /* =======================
           STEP 2 – Inventory
        ======================= */

        setInventoryItems(state, action: PayloadAction<InventoryItem[]>) {
            state.inventoryItems = action.payload;
        },

        addInventoryItem(state, action: PayloadAction<InventoryItem>) {
            state.inventoryItems.push(action.payload);
        },

        updateInventoryItem(
            state,
            action: PayloadAction<{ id: string; data: Partial<InventoryItem> }>
        ) {
            const item = state.inventoryItems.find(i => i.id === action.payload.id);
            if (item) Object.assign(item, action.payload.data);
        },

        removeInventoryItem(state, action: PayloadAction<string>) {
            state.inventoryItems = state.inventoryItems.filter(
                item => item.id !== action.payload
            );
        },

        /* =======================
           STEP 2 – Packages
        ======================= */

        setPackages(state, action: PayloadAction<Package[]>) {
            state.packages = action.payload;
        },

        addPackage(state, action: PayloadAction<Package>) {
            state.packages.push(action.payload);
        },

        updatePackage(
            state,
            action: PayloadAction<{ id: string; data: Partial<Package> }>
        ) {
            state.packages = state.packages.map(pkg => {
                if (pkg.id === action.payload.id) {
                    return { ...pkg, ...action.payload.data };
                }

                if (action.payload.data.isDefault) {
                    return { ...pkg, isDefault: false };
                }

                return pkg;
            });
        },

        removePackage(state, action: PayloadAction<string>) {
            state.packages = state.packages.filter(
                pkg => pkg.id !== action.payload
            );
        },

        /* =======================
           STEP 3 – Microsite
        ======================= */

        updateMicrositeConfig(
            state,
            action: PayloadAction<Partial<MicrositeConfig>>
        ) {
            Object.assign(state.micrositeConfig, action.payload);
        },

        /* =======================
           STEP 3 – Itinerary
        ======================= */

        setItinerary(state, action: PayloadAction<ItineraryDay[]>) {
            state.itinerary = action.payload;
        },

        /* =======================
       STEP 3 – Custom Fields
    ======================= */

        addCustomField(state, action: PayloadAction<CustomField>) {
            state.customFields.push(action.payload);
        },

        updateCustomField(
            state,
            action: PayloadAction<{ id: string; data: Partial<CustomField> }>
        ) {
            const field = state.customFields.find(f => f.id === action.payload.id);
            if (field) Object.assign(field, action.payload.data);
        },

        removeCustomField(state, action: PayloadAction<string>) {
            state.customFields = state.customFields.filter(
                field => field.id !== action.payload
            );
        },

        setCustomFields(state, action: PayloadAction<CustomField[]>) {
            state.customFields = action.payload;
        },


        /* =======================
           RESET
        ======================= */

        resetCreateEvent() {
            return initialState;
        },
    },
});

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

export const {
    updateBasicDetails,

    setRoomBlocks,
    addRoomBlock,
    updateRoomBlock,
    removeRoomBlock,

    setInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    removeInventoryItem,

    setPackages,
    addPackage,
    updatePackage,
    removePackage,

    updateMicrositeConfig,
    setItinerary,

    addCustomField,
    updateCustomField,
    removeCustomField,
    setCustomFields,

    resetCreateEvent,
} = createEventSlice.actions;

export default createEventSlice.reducer;
