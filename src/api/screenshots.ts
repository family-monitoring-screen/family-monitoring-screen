import apiClient from './axios'

export interface Screenshot {
  id: string
  deviceId: string
  deviceName: string
  imageUrl: string
  thumbnailUrl: string
  timestamp: string
}

export interface ScreenshotResponse {
  data: Screenshot[]
  hasNextPage: boolean
  nextPage: number | null
}

export const fetchScreenshots = async (params?: {
  deviceId?: string
  page?: number
  limit?: number
}): Promise<ScreenshotResponse> => {
  const { data } = await apiClient.get('/screenshots', { params })
  return data
}

export const fetchScreenshotById = async (id: string): Promise<Screenshot> => {
  const { data } = await apiClient.get(`/screenshots/${id}`)
  return data.data
}
