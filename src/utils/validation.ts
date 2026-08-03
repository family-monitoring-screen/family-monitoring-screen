export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export const isValidDeviceName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50
}

export const isValidInterval = (interval: number, min: number, max: number): boolean => {
  return interval >= min && interval <= max
}

export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
