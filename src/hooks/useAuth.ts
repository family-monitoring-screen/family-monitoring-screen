import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (!user) {
        navigate('/login')
      }
    })

    return () => unsubscribe()
  }, [setUser, navigate])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
  }
}
