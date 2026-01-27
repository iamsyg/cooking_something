// components/dashboard/GroupRooms.tsx
import { Group } from '@/types'
import {
  BuildingOfficeIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface GroupRoomsProps {
  groups: Group[]
  onGroupSelect: (group: Group) => void
}

export default function GroupRooms({ groups, onGroupSelect }: GroupRoomsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MICE':
        return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
      case 'Wedding':
        return <CalendarIcon className="h-5 w-5 text-pink-500" />
      default:
        return <UserGroupIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {groups.map((group) => (
          <li key={group.id}>
            <button
              onClick={() => onGroupSelect(group)}
              className="block w-full hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(group.type)}
                    <p className="ml-2 truncate text-sm font-medium text-gray-900">
                      {group.name}
                    </p>
                    <span
                      className={`ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        group.status
                      )}`}
                    >
                      {group.status}
                    </span>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {group.roomsBooked}/{group.totalRooms} rooms
                      </span>
                      {group.roomsBooked >= group.totalRooms * 0.9 && (
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      {group.planner}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0">
                      <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      {group.startDate} to {group.endDate}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {group.hotels.map((hotel, index) => (
                      <span
                        key={hotel}
                        className="mr-2 rounded-full bg-gray-100 px-2 py-1 text-xs"
                      >
                        {hotel}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{
                            width: `${(group.roomsBooked / group.totalRooms) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-xs">
                      {Math.round((group.roomsBooked / group.totalRooms) * 100)}% booked
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}