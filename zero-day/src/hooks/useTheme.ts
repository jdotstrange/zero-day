import { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext'

/**
 * Hook to access and control theme configuration
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}
