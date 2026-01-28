// types/index.ts

export default interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Group {
  id: string
  name: string
  type: 'MICE' | 'Wedding'
  planner: string
  status: 'active' | 'pending' | 'completed'
  roomsBooked: number
  totalRooms: number
  startDate: string
  endDate: string
  hotels: string[]
}

export interface Conversation {
  id: string
  groupId: string
  plannerName: string
  lastMessage: string
  lastUpdated: string
  unread: boolean
}

export interface Link {
  id: string
  groupId: string
  plannerUrl: string
  guestUrl: string
  createdAt: string
  expiresAt: string
  isActive: boolean
}