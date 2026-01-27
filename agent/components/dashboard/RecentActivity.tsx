// components/dashboard/RecentActivity.tsx
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    type: 'warning',
    title: 'Room block nearly full',
    description: 'TechCorp Annual Conference: 47/50 rooms booked',
    time: '10 minutes ago',
    icon: ExclamationTriangleIcon,
  },
  {
    id: 2,
    type: 'success',
    title: 'New booking confirmed',
    description: 'Smith-Wilson Wedding: 2 rooms booked by guest',
    time: '1 hour ago',
    icon: CheckCircleIcon,
  },
  {
    id: 3,
    type: 'info',
    title: 'Link generated',
    description: 'New planner and guest links created for Global Summit 2024',
    time: '2 hours ago',
    icon: BellIcon,
  },
  {
    id: 4,
    type: 'warning',
    title: 'Conversation update',
    description: 'Sarah Johnson requested room block extension',
    time: '3 hours ago',
    icon: ExclamationTriangleIcon,
  },
]

export default function RecentActivity() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-400'
      case 'success':
        return 'text-green-400'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">Latest updates on your groups</p>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <activity.icon
                    className={`h-6 w-6 ${getTypeColor(activity.type)}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}