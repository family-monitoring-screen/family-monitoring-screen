import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchActivities } from '@/api/activities'
import { fetchDevices } from '@/api/devices'
import { useQuery } from '@tanstack/react-query'
import LoadingScreen from '@/components/common/LoadingScreen'
import { formatDateTime, formatDistanceToNow } from '@/utils/format'

const activityIcons: Record<string, string> = {
  app_install: '📦',
  app_uninstall: '🗑️',
  screen_unlock: '🔓',
  screen_lock: '🔒',
  location_update: '📍',
  device_online: '🟢',
  device_offline: '🔴',
  battery_low: '🪫',
  wifi_change: '📶',
  screenshot_taken: '📸',
  call_made: '📞',
  message_sent: '💬',
}

export default function Activity() {
  const [selectedDevice, setSelectedDevice] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })

  const {
    data: activitiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['activities', selectedDevice, selectedType, dateRange],
    queryFn: ({ pageParam = 1 }) =>
      fetchActivities({
        page: pageParam,
        limit: 30,
        deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
      }),
    getNextPageParam: (lastPage: any) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  })

  const activities = activitiesData?.pages.flatMap((page) => page.data || page) || []

  if (isLoading) return <LoadingScreen />

  // Get unique activity types
  const activityTypes = [...new Set(activities.map((a: any) => a.type))]

  // Filter activities based on selected type
  const filteredActivities = selectedType === 'all'
    ? activities
    : activities.filter((a: any) => a.type === selectedType)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-1">Detailed activity history across all devices</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Devices</option>
            {devices?.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <div className="flex-1" />

          <div className="text-sm text-gray-500 flex items-center">
            {filteredActivities.length} activities found
          </div>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity: any, index: number) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-xl shadow-sm p-4 flex items-start space-x-4"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
              {activityIcons[activity.type] || '📋'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp))}
                </span>
              </div>
              
              <div className="flex items-center mt-1 space-x-4">
                <span className="text-xs text-gray-500">
                  {activity.deviceName || 'System'}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {activity.type.replace(/_/g, ' ')}
                </span>
              </div>
              
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(activity.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No activities found</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Activities'}
          </button>
        </div>
      )}
    </div>
  )
}
