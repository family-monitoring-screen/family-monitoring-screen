import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchDevices } from '@/api/devices'
import { useSocket } from '@/hooks/useSocket'
import LoadingScreen from '@/components/common/LoadingScreen'
import LiveScreen from '@/components/monitoring/LiveScreen'
import toast from 'react-hot-toast'

export default function Monitoring() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const socket = useSocket()

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })

  const onlineDevices = devices?.filter((d) => d.status === 'online') || []

  const handleRefresh = useCallback(() => {
    if (selectedDevice && socket) {
      socket.emit('request-screenshot', { deviceId: selectedDevice })
      toast.success('Screenshot requested')
    }
  }, [selectedDevice, socket])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (autoRefresh && selectedDevice) {
      interval = setInterval(() => {
        handleRefresh()
      }, refreshInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, selectedDevice, handleRefresh])

  useEffect(() => {
    if (socket) {
      socket.on('screenshot-update', (data: any) => {
        if (data.deviceId === selectedDevice) {
          // Update screenshot in real-time
        }
      })

      return () => {
        socket.off('screenshot-update')
      }
    }
  }, [socket, selectedDevice])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Monitoring</h1>
            <p className="text-gray-600 mt-1">Real-time device screen monitoring</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={toggleFullScreen}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Full Screen
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Device Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4"
        >
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
                  <p className="text-xs text-gray-500">{device.model}</p>
                </div>
              </button>
            ))}

            {onlineDevices.length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No online devices</p>
              </div>
            )}
          </div>

          {/* Controls */}
          {selectedDevice && (
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto Refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {autoRefresh && (
                <div>
                  <label className="text-sm text-gray-700 block mb-2">
                    Refresh Interval: {refreshInterval / 1000}s
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="1000"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Screen Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-sm p-4"
        >
          {selectedDevice ? (
            <LiveScreen deviceId={selectedDevice} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Device Selected</h3>
              <p className="text-sm text-gray-500">
                Select an online device from the list to start monitoring
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
            }
