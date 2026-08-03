import { motion } from 'framer-motion'
import { Notification } from '@/types/notification'
import { formatDistanceToNow } from '@/utils/format'

interface NotificationCenterProps {
  notifications: Notification[]
}

export default function NotificationCenter({ notifications }: NotificationCenterProps) {
  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        {unreadNotifications.length > 0 && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {unreadNotifications.length} new
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className={`p-3 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatDistanceToNow(new Date(notification.timestamp))}
            </p>
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No notifications
          </p>
        )}
      </div>
    </motion.div>
  )
}
