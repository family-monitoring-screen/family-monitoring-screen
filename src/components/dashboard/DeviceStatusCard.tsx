import { motion } from 'framer-motion'
import { Device } from '@/types/device'

interface DeviceStatusCardProps {
  devices: Device[]
}

export default function DeviceStatusCard({ devices }: DeviceStatusCardProps) {
  const onlineDevices = devices.filter((d) => d.status === 'online')
  const offlineDevices = devices.filter((d) => d.status === 'offline')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h2>
      
      <div className="space-y-4">
        {onlineDevices.map((device) => (
          <div key={device.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                <p className="text-xs text-gray-500">{device.model}</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        ))}

        {offlineDevices.map((device) => (
          <div key={device.id} className="flex items-center justify-between opacity-60">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                <p className="text-xs text-gray-500">{device.model}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">Offline</span>
          </div>
        ))}

        {devices.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No devices connected
          </p>
        )}
      </div>
    </motion.div>
  )
}
