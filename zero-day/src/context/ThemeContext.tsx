import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  type ThemeConfig,
  type ThemeMode,
  type ThemeDirection,
  type ThemeColor,
  type SidebarLayout,
  type ContainerType,
  type CardStyle,
  defaultThemeConfig,
  themeColorPresets,
} from '@/types/theme'

const STORAGE_KEY = 'zeroday-theme'

interface ThemeContextValue {
  config: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setDirection: (direction: ThemeDirection) => void
  setColor: (color: ThemeColor) => void
  setSidebarLayout: (sidebarLayout: SidebarLayout) => void
  setContainer: (container: ContainerType) => void
  setCardStyle: (cardStyle: CardStyle) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  resetTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') return defaultThemeConfig
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...defaultThemeConfig, ...parsed }
      }
    } catch {
      // Invalid JSON, clear it
      localStorage.removeItem(STORAGE_KEY)
    }
    return defaultThemeConfig
  })

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement

    // Mode (dark/light) - explicitly add or remove
    if (config.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Direction (ltr/rtl)
    root.dir = config.direction

    // Color preset - apply CSS variables
    const colorPreset = themeColorPresets[config.color]
    root.style.setProperty('--theme-primary', colorPreset.primary)
    root.style.setProperty('--theme-accent', colorPreset.accent)

    // Sidebar layout type (for Full/Admin layout)
    root.dataset.sidebarLayout = config.sidebarLayout

    // Container type
    root.dataset.container = config.container

    // Card style
    root.dataset.cardStyle = config.cardStyle

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const setMode = useCallback((mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }))
  }, [])

  const setDirection = useCallback((direction: ThemeDirection) => {
    setConfig((prev) => ({ ...prev, direction }))
  }, [])

  const setColor = useCallback((color: ThemeColor) => {
    setConfig((prev) => ({ ...prev, color }))
  }, [])

  const setSidebarLayout = useCallback((sidebarLayout: SidebarLayout) => {
    setConfig((prev) => ({ ...prev, sidebarLayout }))
  }, [])

  const setContainer = useCallback((container: ContainerType) => {
    setConfig((prev) => ({ ...prev, container }))
  }, [])

  const setCardStyle = useCallback((cardStyle: CardStyle) => {
    setConfig((prev) => ({ ...prev, cardStyle }))
  }, [])

  const setSidebarCollapsed = useCallback((sidebarCollapsed: boolean) => {
    setConfig((prev) => ({ ...prev, sidebarCollapsed }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setConfig((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }, [])

  const resetTheme = useCallback(() => {
    setConfig(defaultThemeConfig)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        config,
        setMode,
        setDirection,
        setColor,
        setSidebarLayout,
        setContainer,
        setCardStyle,
        setSidebarCollapsed,
        toggleSidebar,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
