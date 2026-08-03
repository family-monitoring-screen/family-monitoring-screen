export interface Device {
  id: string
  name: string
  model: string
  os: string
  status: 'online' | 'offline'
  lastSync: string
  batteryLevel: number
  ipAddress?: string
  location?: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}

export interface DeviceActivity {
  id: string
  deviceId: string
  type: string
  description: string
  timestamp: string
}
