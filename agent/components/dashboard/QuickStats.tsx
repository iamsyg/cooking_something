// components/dashboard/QuickStats.tsx
import { Group } from '@/types'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

interface QuickStatsProps {
  groups: Group[]
}

export default function QuickStats({ groups }: QuickStatsProps) {
  const totalGroups = groups.length
  const activeGroups = groups.filter((g) => g.status === 'active').length
  const miceGroups = groups.filter((g) => g.type === 'MICE').length
  const weddingGroups = groups.filter((g) => g.type === 'Wedding').length
  const totalRooms = groups.reduce((sum, group) => sum + group.totalRooms, 0)
  const bookedRooms = groups.reduce((sum, group) => sum + group.roomsBooked, 0)
  const occupancyRate = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0

  const stats = [
    {
      name: 'Total Groups',
      value: totalGroups,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Groups',
      value: activeGroups,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'MICE Events',
      value: miceGroups,
      icon: BuildingOfficeIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Weddings',
      value: weddingGroups,
      icon: CalendarIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      name: 'Room Occupancy',
      value: `${occupancyRate.toFixed(1)}%`,
      icon: ChartBarIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <div className="flex items-center">
            <div className={`rounded-md ${stat.bgColor} p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </dt>
                <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}