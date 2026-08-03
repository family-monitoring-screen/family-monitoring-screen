import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  isFullScreen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleFullScreen: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  isFullScreen: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
  setTheme: (theme) => set({ theme }),
}))
