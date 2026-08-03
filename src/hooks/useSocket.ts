import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketRef.current.on('connect', () => {
        console.log('Socket connected')
      })

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error)
      })

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    }
  }, [isAuthenticated])

  return socketRef.current
}
