import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchDevices } from '@/api/devices'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import LoadingScreen from '@/components/common/LoadingScreen'

// In production, this would come from the API
const fetchScreenTime = async (deviceId: string, period: string) => {
  const { data } = await (await import('@/api/axios')).default.get(`/devices/${deviceId}/screen-time`, {
    params: { period }
  })
  return data.data
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function ScreenTime() {
  const [selectedDevice, setSelectedDevice] = useState<string>('all')
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })

  const { data: screenTimeData, isLoading } = useQuery({
    queryKey: ['screenTime', selectedDevice, period],
    queryFn: () => fetchScreenTime(selectedDevice === 'all' ? '' : selectedDevice, period),
    enabled: !!selectedDevice,
  })

  if (devicesLoading) return <LoadingScreen />

  const dailyData = screenTimeData?.daily || []
  const appUsageData = screenTimeData?.apps || []
  const totalScreenTime = screenTimeData?.total || 0

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Time</h1>
            <p className="text-gray-600 mt-1">Monitor device usage and app activity</p>
          </div>

          <div className="flex items-center space-x-3">
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

            <div className="flex bg-gray-100 rounded-lg p-1">
              {['today', 'week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize ${
                    period === p ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white"
        >
          <p className="text-sm opacity-90">Total Screen Time</p>
          <p className="text-3xl font-bold mt-2">{formatTime(totalScreenTime)}</p>
          <p className="text-xs opacity-75 mt-1">Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white"
        >
          <p className="text-sm opacity-90">Apps Used</p>
          <p className="text-3xl font-bold mt-2">{appUsageData.length}</p>
          <p className="text-xs opacity-75 mt-1">Unique applications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white"
        >
          <p className="text-sm opacity-90">Pickups</p>
          <p className="text-3xl font-bold mt-2">{screenTimeData?.pickups || 0}</p>
          <p className="text-xs opacity-75 mt-1">Device unlocks</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={formatTime} />
                <Tooltip formatter={(value: number) => formatTime(value)} />
                <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* App Usage Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">App Usage Breakdown</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appUsageData}
                  dataKey="minutes"
                  nameKey="appName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ appName, percent }) => `${appName} ${(percent * 100).toFixed(0)}%`}
                >
                  {appUsageData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTime(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* App Usage Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">App Usage Details</h2>
        
        {appUsageData.length > 0 ? (
          <div className="space-y-4">
            {appUsageData.map((app: any, index: number) => (
              <div key={app.appName} className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-gray-600">
                    {app.appName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{app.appName}</p>
                    <p className="text-sm text-gray-600">{formatTime(app.minutes)}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(app.minutes / totalScreenTime) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No app usage data available</p>
        )}
      </motion.div>
    </div>
  )
}
