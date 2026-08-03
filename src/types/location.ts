export interface LocationData {
  id: string
  deviceId: string
  latitude: number
  longitude: number
  accuracy: number
  speed: number | null
  altitude: number | null
  bearing: number | null
  timestamp: string
  provider: 'gps' | 'network' | 'passive'
}

export interface Geofence {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
  enabled: boolean
  createdAt: string
}

export interface LocationHistory {
  locations: LocationData[]
  totalDistance: number
  totalDuration: number
  startTime: string
  endTime: string
}
