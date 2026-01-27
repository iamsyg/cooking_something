// components/dashboard/LinkGenerator.tsx
'use client'

import { useState } from 'react'
import { Group, Link } from '@/types'
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

interface LinkGeneratorProps {
  groups: Group[]
  generatedLinks: Link[]
  onGenerateLink: (linkData: any) => void
}

export default function LinkGenerator({
  groups,
  generatedLinks,
  onGenerateLink,
}: LinkGeneratorProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [showGenerated, setShowGenerated] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!selectedGroupId || !expiryDate) return

    const selectedGroup = groups.find((g) => g.id === selectedGroupId)
    if (selectedGroup) {
      onGenerateLink({
        groupId: selectedGroupId,
        groupName: selectedGroup.name,
        expiryDate,
      })
      setShowGenerated(true)
    }
  }

  const copyToClipboard = (text: string, linkId: string) => {
    navigator.clipboard.writeText(text)
    setCopied(linkId)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Link Generator Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-medium text-gray-900">Generate New Links</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create unique links for planners and guests
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Group
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Choose a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedGroupId || !expiryDate}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            Generate Links
          </button>
        </div>
      </div>

      {/* Generated Links List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Generated Links</h3>
        </div>
        <div className="overflow-hidden">
          {generatedLinks.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No links generated yet</p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {generatedLinks.map((link) => (
                <li key={link.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          Active
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          Expires: {formatDate(link.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(link.plannerUrl, link.id + '-planner')}
                        className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
                      >
                        {copied === link.id + '-planner' ? (
                          <>
                            <CheckCircleIcon className="mr-1 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <DocumentDuplicateIcon className="mr-1 h-4 w-4" />
                            Planner Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(link.guestUrl, link.id + '-guest')}
                        className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-200"
                      >
                        {copied === link.id + '-guest' ? (
                          <>
                            <CheckCircleIcon className="mr-1 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <DocumentDuplicateIcon className="mr-1 h-4 w-4" />
                            Guest Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="rounded-md bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Planner Link</p>
                      <p className="truncate text-sm text-gray-900">{link.plannerUrl}</p>
                    </div>
                    <div className="rounded-md bg-indigo-50 p-3">
                      <p className="text-xs font-medium text-indigo-500">Guest Link</p>
                      <p className="truncate text-sm text-indigo-900">{link.guestUrl}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}