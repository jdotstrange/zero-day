import { useTheme } from '@/hooks/useTheme'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
}

/**
 * Logo Component
 * Displays the 0-Day logo with automatic theme switching
 */
export function Logo({ 
  className = '', 
  width = 125, 
  height = 24,
  showText = true
}: LogoProps) {
  const { config } = useTheme()
  const isDark = config.mode === 'dark'
  
  // Use dark logo for dark theme, light logo for light theme
  const logoSrc = isDark 
    ? '/assets/logo/logo-dark.svg' 
    : '/assets/logo/logo.svg'

  if (showText) {
    return (
      <img 
        src={logoSrc} 
        alt="0-Day" 
        className={className}
        style={{ width, height }}
      />
    )
  }

  // Icon only version - use logomark.svg
  return (
    <img 
      src="/assets/logo/logomark.svg" 
      alt="0-Day" 
      className={className}
      style={{ width: height, height }}
    />
  )
}
