// types/index.ts
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