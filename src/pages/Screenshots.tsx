import { useState } from 'react'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchDevices } from '@/api/devices'
import { fetchScreenshots } from '@/api/screenshots'
import LoadingScreen from '@/components/common/LoadingScreen'
import { formatDateTime } from '@/utils/format'

export default function Screenshots() {
  const [selectedDevice, setSelectedDevice] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })

  const {
    data: screenshotsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['screenshots', selectedDevice],
    queryFn: ({ pageParam = 1 }) => fetchScreenshots({ 
      deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
      page: pageParam,
      limit: 20,
    }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined
    },
  })

  const screenshots = screenshotsData?.pages.flatMap((page) => page.data) || []

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Screenshots</h1>
        <p className="text-gray-600 mt-1">View and manage captured screenshots</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Devices</option>
          {devices?.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'grid' ? 'bg-white shadow' : ''
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'list' ? 'bg-white shadow' : ''
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Screenshots Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'space-y-4'
      }>
        {screenshots.map((screenshot: any, index: number) => (
          <motion.div
            key={screenshot.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={
              viewMode === 'grid'
                ? 'bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
                : 'bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4'
            }
            onClick={() => setSelectedImage(screenshot.imageUrl)}
          >
            <img
              src={screenshot.thumbnailUrl || screenshot.imageUrl}
              alt={`Screenshot ${screenshot.id}`}
              className={
                viewMode === 'grid'
                  ? 'w-full h-40 object-cover'
                  : 'w-24 h-16 object-cover rounded'
              }
            />
            <div className={viewMode === 'grid' ? 'p-3' : 'flex-1'}>
              <p className="text-sm font-medium text-gray-900">
                {screenshot.deviceName}
              </p>
              <p className="text-xs text-gray-500">
                {formatDateTime(screenshot.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}

        {screenshots.length === 0 && (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No screenshots found</p>
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
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Full size screenshot"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
