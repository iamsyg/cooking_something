// types/event.ts
export type EventType = 'MICE' | 'Wedding';
export type MiceSubType = 'Meetings' | 'Incentives' | 'Conferences' | 'Exhibitions';
export type ServiceType = 'hotel' | 'transport' | 'catering' | 'av' | 'internet' | 'booth' | 'gift';
export type PricingModel = 'perPerson' | 'perRoom' | 'package' | 'perDay' | 'perBooth';



export type EventStatus = 'Draft' | 'Active' | 'Completed' | 'Cancelled';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export interface InventoryItem {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  quantity: number;
  unitPrice: number;
  pricingModel: PricingModel;
  included: boolean;
  isOptionalUpgrade: boolean;
  upgradePrice?: number;
  requiredFor: MiceSubType[];
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  includedServices: string[];
  optionalUpgrades: string[];
  isDefault: boolean;
}

export interface RoomBlock {
  id: string;
  hotelName: string;
  roomType: string;
  totalRooms: number;
  ratePerNight: number;
  amenities: string[];
  locked: boolean;
  releaseDate?: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  value: string;
  options?: string[];
  required: boolean;
  forType: MiceSubType[];
}