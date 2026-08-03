import { useEffect, useState } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { motion } from 'framer-motion'

interface LiveScreenProps {
  deviceId: string
}

export default function LiveScreen({ deviceId }: LiveScreenProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
      setLoading(true)
      
      // Request initial screenshot
      socket.emit('join-device-room', { deviceId })
      socket.emit('request-screenshot', { deviceId })

      socket.on('screenshot-update', (data: { deviceId: string; image: string }) => {
        if (data.deviceId === deviceId) {
          setScreenshot(data.image)
          setLoading(false)
        }
      })

      return () => {
        socket.emit('leave-device-room', { deviceId })
        socket.off('screenshot-update')
      }
    }
  }, [socket, deviceId])

  return (
    <div className="relative">
      {loading && !screenshot && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Loading screen...</p>
          </div>
        </div>
      )}

      {screenshot ? (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={screenshot}
          alt="Device Screen"
          className="w-full rounded-lg"
        />
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-100 rounded-lg">
            <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">No screenshot available</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              Request Screenshot
            </button>
          </div>
        )
      )}

      {/* Device Info Overlay */}
      {screenshot && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
          Live
        </div>
      )}
    </div>
  )
}
