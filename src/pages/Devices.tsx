import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchDevices, removeDevice } from '@/api/devices'
import LoadingScreen from '@/components/common/LoadingScreen'
import toast from 'react-hot-toast'

export default function Devices() {
  const queryClient = useQueryClient()
  
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 30000, // Auto refresh every 30 seconds
  })

  const removeMutation = useMutation({
    mutationFn: removeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      toast.success('Device removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove device')
    },
  })

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
            <p className="text-gray-600 mt-1">Manage connected devices</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Auto refresh: 30s
            </span>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['devices'] })}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <h3 className="font-semibold text-gray-900">{device.name}</h3>
              </div>
              <button
                onClick={() => removeMutation.mutate(device.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Model</span>
                <span className="text-gray-900">{device.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">OS</span>
                <span className="text-gray-900">{device.os}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Sync</span>
                <span className="text-gray-900">
                  {new Date(device.lastSync).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Battery</span>
                <span className={`font-medium ${
                  device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {device.batteryLevel}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {devices?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No devices</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by connecting a device using the client link.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
