import { create } from 'zustand'
import { Device } from '@/types/device'

interface DeviceState {
  devices: Device[]
  selectedDevice: string | null
  setDevices: (devices: Device[]) => void
  setSelectedDevice: (deviceId: string | null) => void
  addDevice: (device: Device) => void
  removeDevice: (deviceId: string) => void
  updateDevice: (deviceId: string, updates: Partial<Device>) => void
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  selectedDevice: null,
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (deviceId) => set({ selectedDevice: deviceId }),
  addDevice: (device) =>
    set((state) => ({ devices: [...state.devices, device] })),
  removeDevice: (deviceId) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== deviceId),
    })),
  updateDevice: (deviceId, updates) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, ...updates } : d
      ),
    })),
}))
