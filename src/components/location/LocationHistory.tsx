import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchLocationHistory } from '@/api/locations'
import { formatDateTime } from '@/utils/format'
import LoadingScreen from '@/components/common/LoadingScreen'

interface LocationHistoryProps {
  deviceId: string
}

export default function LocationHistory({ deviceId }: LocationHistoryProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  })

  const { data: locations, isLoading } = useQuery({
    queryKey: ['locationHistory', deviceId, dateRange],
    queryFn: () => fetchLocationHistory(deviceId, dateRange),
  })

  if (isLoading) return <LoadingScreen />

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Location History</h2>
        
        <div className="flex items-center space-x-3">
          <input
            type="datetime-local"
            value={dateRange.startDate.slice(0, 16)}
            onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value).toISOString() })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="datetime-local"
            value={dateRange.endDate.slice(0, 16)}
            onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value).toISOString() })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {locations && locations.length > 0 ? (
        <div className="space-y-3">
          {locations.map((location, index) => (
            <div
              key={location.id || index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Accuracy: {location.accuracy}m • Speed: {location.speed || 0} km/h
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatDateTime(location.timestamp)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No location history for selected period</p>
        </div>
      )}

      {/* Total Stats */}
      {locations && locations.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Total Points</p>
            <p className="text-lg font-semibold text-gray-900">{locations.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time Range</p>
            <p className="text-lg font-semibold text-gray-900">
              {locations.length > 0 ? 
                `${Math.round((new Date(locations[0].timestamp).getTime() - new Date(locations[locations.length - 1].timestamp).getTime()) / 3600000)}h` 
                : '0h'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Accuracy</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(locations.reduce((sum, loc) => sum + loc.accuracy, 0) / locations.length)}m
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
