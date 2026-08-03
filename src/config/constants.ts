export const API_URL = import.meta.env.VITE_API_URL as string
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string

export const REFRESH_INTERVALS = {
  DEVICES: 30000, // 30 seconds
  LOCATION: 10000, // 10 seconds
  SCREENSHOT: 5000, // 5 seconds
  NOTIFICATIONS: 15000, // 15 seconds
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
}

export const DATE_FORMATS = {
  FULL: 'PPpp',
  DATE: 'PP',
  TIME: 'p',
  SHORT: 'P',
}

export const SCREENSHOT_SETTINGS = {
  MIN_INTERVAL: 10,
  MAX_INTERVAL: 300,
  DEFAULT_INTERVAL: 30,
}

export const LOCATION_SETTINGS = {
  MIN_INTERVAL: 30,
  MAX_INTERVAL: 600,
  DEFAULT_INTERVAL: 60,
}
