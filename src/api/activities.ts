import apiClient from './axios'
import { Activity } from '@/types/activity'

export const fetchActivities = async (params?: {
  page?: number
  limit?: number
  deviceId?: string
}): Promise<Activity[]> => {
  const { data } = await apiClient.get('/activities', { params })
  return data.data
}

export const fetchActivityById = async (id: string): Promise<Activity> => {
  const { data } = await apiClient.get(`/activities/${id}`)
  return data.data
}
