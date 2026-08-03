const PREFIX = 'family_monitor_'

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
        }
