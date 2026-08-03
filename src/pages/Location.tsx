import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchDevices } from '@/api/devices'
import { fetchLocations } from '@/api/locations'
import { useSocket } from '@/hooks/useSocket'
import LoadingScreen from '@/components/common/LoadingScreen'
import LiveMap from '@/components/location/LiveMap'
import LocationHistory from '@/components/location/LocationHistory'

export default function Location() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live')
  const socket = useSocket()

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', selectedDevice],
    queryFn: () => fetchLocations(selectedDevice!),
    enabled: !!selectedDevice && activeTab === 'live',
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  useEffect(() => {
    if (socket && selectedDevice) {
      socket.emit('join-location-room', { deviceId: selectedDevice })

      socket.on('location-update', (data: any) => {
        // Update location in real-time
      })

      return () => {
        socket.emit('leave-location-room', { deviceId: selectedDevice })
        socket.off('location-update')
      }
    }
  }, [socket, selectedDevice])

  if (devicesLoading) return <LoadingScreen />

  const onlineDevices = devices?.filter((d) => d.status === 'online') || []

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Location Tracking</h1>
        <p className="text-gray-600 mt-1">Real-time GPS location monitoring</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Device Selection & Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Devices</h2>
            
            <div className="space-y-2">
              {onlineDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    selectedDevice === device.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{device.name}</p>
                    <p className="text-xs text-gray-500">
                      Battery: {device.batteryLevel}%
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Tabs */}
            {selectedDevice && (
              <div className="mt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('live')}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'live'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Live
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'history'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          {selectedDevice ? (
            activeTab === 'live' ? (
              <LiveMap
                deviceId={selectedDevice}
                location={locations?.[0]}
                isLoading={locationsLoading}
              />
            ) : (
              <LocationHistory deviceId={selectedDevice} />
            )
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Device Selected
              </h3>
              <p className="text-sm text-gray-500">
                Select an online device to view its location
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
                }
