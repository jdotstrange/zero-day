import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

/**
 * Hook to access auth session and sign-in/out helpers
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
