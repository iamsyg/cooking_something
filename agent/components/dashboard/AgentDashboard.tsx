// components/dashboard/AgentDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import GroupRooms from './GroupRooms'
import ConversationChannel from './ConversationChannel'
import LinkGenerator from './LinkGenerator'
import QuickStats from './QuickStats'
import RecentActivity from './RecentActivity'
import { Group, Conversation, Link } from '@/types'

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<'groups' | 'conversations' | 'links'>('groups')
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [generatedLinks, setGeneratedLinks] = useState<Link[]>([])

  useEffect(() => {
    // Mock data - replace with API calls
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'TechCorp Annual Conference',
        type: 'MICE',
        planner: 'Sarah Johnson',
        status: 'active',
        roomsBooked: 47,
        totalRooms: 50,
        startDate: '2024-06-15',
        endDate: '2024-06-18',
        hotels: ['Marriott', 'Hilton'],
      },
      {
        id: '2',
        name: 'Smith-Wilson Wedding',
        type: 'Wedding',
        planner: 'Emily Wilson',
        status: 'active',
        roomsBooked: 25,
        totalRooms: 30,
        startDate: '2024-07-20',
        endDate: '2024-07-24',
        hotels: ['Four Seasons', 'Ritz Carlton'],
      },
    ]
    
    const mockConversations: Conversation[] = [
      {
        id: '1',
        groupId: '1',
        plannerName: 'Sarah Johnson',
        lastMessage: 'Can we increase the room block to 60?',
        lastUpdated: '2024-01-15T10:30:00',
        unread: true,
      },
    ]

    setGroups(mockGroups)
    setConversations(mockConversations)
  }, [])

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
    setActiveTab('conversations')
  }

  const handleGenerateLink = (linkData: any) => {
    const newLink: Link = {
      id: Date.now().toString(),
      groupId: linkData.groupId,
      plannerUrl: `https://tbo.com/planner/${linkData.groupId}`,
      guestUrl: `https://tbo.com/guest/${linkData.groupId}`,
      createdAt: new Date().toISOString(),
      expiresAt: linkData.expiresAt,
      isActive: true,
    }
    setGeneratedLinks([newLink, ...generatedLinks])
  }

  const handleMessageSend = (message: string, conversationId: string) => {
    // Handle sending message
    console.log('Sending message:', message, 'to conversation:', conversationId)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Agent Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage MICE events and destination wedding groups
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            + Create New Group
          </button>
        </div>
      </div>

      <QuickStats groups={groups} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('groups')}
                className={`${
                  activeTab === 'groups'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
              >
                Group Rooms
              </button>
              <button
                onClick={() => setActiveTab('conversations')}
                className={`${
                  activeTab === 'conversations'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
              >
                Conversations
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`${
                  activeTab === 'links'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
              >
                Generated Links
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'groups' && (
              <GroupRooms groups={groups} onGroupSelect={handleGroupSelect} />
            )}
            {activeTab === 'conversations' && (
              <ConversationChannel
                conversations={conversations}
                selectedGroup={selectedGroup}
                onMessageSend={handleMessageSend}
              />
            )}
            {activeTab === 'links' && (
              <LinkGenerator
                groups={groups}
                generatedLinks={generatedLinks}
                onGenerateLink={handleGenerateLink}
              />
            )}
          </div>
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}