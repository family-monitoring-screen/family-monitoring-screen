import apiClient from './axios'
import { Device } from '@/types/device'

export const fetchDevices = async (): Promise<Device[]> => {
  const { data } = await apiClient.get('/devices')
  return data.data
}

export const fetchDeviceById = async (id: string): Promise<Device> => {
  const { data } = await apiClient.get(`/devices/${id}`)
  return data.data
}

export const generateClientLink = async (): Promise<{ link: string; qrCode: string }> => {
  const { data } = await apiClient.post('/devices/generate-link')
  return data.data
}

export const approveDevice = async (deviceId: string): Promise<void> => {
  await apiClient.post(`/devices/${deviceId}/approve`)
}

export const removeDevice = async (deviceId: string): Promise<void> => {
  await apiClient.delete(`/devices/${deviceId}`)
}
