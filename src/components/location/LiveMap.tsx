import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSocket } from '@/hooks/useSocket'

interface LiveMapProps {
  deviceId: string
  location?: {
    latitude: number
    longitude: number
    timestamp: string
  }
  isLoading: boolean
}

export default function LiveMap({ deviceId, location, isLoading }: LiveMapProps) {
  const [markers, setMarkers] = useState<any[]>([])
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
      socket.on('location-update', (data: any) => {
        if (data.deviceId === deviceId) {
          setMarkers((prev) => [
            ...prev,
            {
              latitude: data.latitude,
              longitude: data.longitude,
              timestamp: data.timestamp,
            },
          ])
        }
      })

      return () => {
        socket.off('location-update')
      }
    }
  }, [socket, deviceId])

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Loading location...</p>
          </div>
        </div>
      ) : location ? (
        <div className="space-y-4">
          {/* Map Placeholder - In production, integrate with Google Maps or Mapbox */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z" />
              </svg>
              <p className="text-sm text-gray-600">
                Lat: {location.latitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Lng: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(location.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Pulsing dot to simulate live tracking */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full opacity-30" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full m-2" />
            </motion.div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Latitude</p>
              <p className="text-lg font-semibold text-gray-900">
                {location.latitude.toFixed(6)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Longitude</p>
              <p className="text-lg font-semibold text-gray-900">
                {location.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Location History Trail */}
          {markers.length > 1 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Movement Trail ({markers.length} points)
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {markers.slice(-10).reverse().map((marker, index) => (
                  <div key={index} className="flex items-center justify-between py-1 text-xs">
                    <span className="text-gray-600">
                      {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                    </span>
                    <span className="text-gray-400">
                      {new Date(marker.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-500">No location data available</p>
          <p className="text-xs text-gray-400 mt-1">Waiting for GPS signal...</p>
        </div>
      )}
    </div>
  )
}
