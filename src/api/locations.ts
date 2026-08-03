import apiClient from './axios'

export interface Location {
  id: string
  deviceId: string
  latitude: number
  longitude: number
  accuracy: number
  speed: number
  timestamp: string
}

export const fetchLocations = async (deviceId: string): Promise<Location[]> => {
  const { data } = await apiClient.get(`/devices/${deviceId}/locations`)
  return data.data
}

export const fetchLocationHistory = async (
  deviceId: string,
  params?: { startDate?: string; endDate?: string }
): Promise<Location[]> => {
  const { data } = await apiClient.get(`/devices/${deviceId}/locations/history`, { params })
  return data.data
}
