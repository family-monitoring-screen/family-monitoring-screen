export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt: string
  lastLoginAt: string
}

export interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: UserProfile
  token: string
  refreshToken: string
  expiresIn: number
}
