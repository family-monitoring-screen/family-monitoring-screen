import apiClient from './axios'
import { Notification } from '@/types/notification'

export const fetchNotifications = async (params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
}): Promise<Notification[]> => {
  const { data } = await apiClient.get('/notifications', { params })
  return data.data
}

export const markAsRead = async (notificationId: string): Promise<void> => {
  await apiClient.put(`/notifications/${notificationId}/read`)
}

export const markAllAsRead = async (): Promise<void> => {
  await apiClient.put('/notifications/read-all')
}
