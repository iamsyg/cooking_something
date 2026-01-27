// components/dashboard/ConversationChannel.tsx
'use client'

import { useState } from 'react'
import { Group, Conversation } from '@/types'
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface ConversationChannelProps {
  conversations: Conversation[]
  selectedGroup: Group | null
  onMessageSend: (message: string, conversationId: string) => void
}

export default function ConversationChannel({
  conversations,
  selectedGroup,
  onMessageSend,
}: ConversationChannelProps) {
  const [message, setMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0] || null
  )

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      onMessageSend(message, selectedConversation.id)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[600px] overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Conversations list */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">Conversations</h3>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 text-left hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {conversation.plannerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {conversation.unread && (
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {conversation.lastMessage}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedConversation.plannerName}
                  </h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Messages will be rendered here */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-xs rounded-lg bg-indigo-600 px-4 py-2 text-white">
                    <p className="text-sm">Hi, I can help you with the room block increase.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-xs rounded-lg bg-gray-100 px-4 py-2">
                    <p className="text-sm">Can we increase the room block to 60?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="rounded-lg bg-indigo-600 p-3 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}