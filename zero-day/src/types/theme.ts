/**
 * Theme Configuration Types
 * Defines all customizable theme options for 0-Day
 */

/** Light or Dark mode */
export type ThemeMode = 'light' | 'dark'

/** Text direction for RTL/LTR support */
export type ThemeDirection = 'ltr' | 'rtl'

/** Available theme color presets */
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan'

/** Sidebar layout for admin area (Full layout only) */
export type SidebarLayout = 'vertical' | 'horizontal'

/** Container width option */
export type ContainerType = 'full' | 'boxed'

/** Card styling option */
export type CardStyle = 'shadow' | 'border'

/** Complete theme configuration */
export interface ThemeConfig {
  mode: ThemeMode
  direction: ThemeDirection
  color: ThemeColor
  sidebarLayout: SidebarLayout
  container: ContainerType
  cardStyle: CardStyle
  sidebarCollapsed: boolean
}

/** Default theme configuration */
export const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  direction: 'ltr',
  color: 'blue',
  sidebarLayout: 'vertical',
  container: 'full',
  cardStyle: 'shadow',
  sidebarCollapsed: false,
}

/** Theme color palettes - CSS variable overrides */
export const themeColorPresets: Record<ThemeColor, { primary: string; accent: string }> = {
  blue: {
    primary: '59 130 246',    // #3b82f6
    accent: '99 102 241',     // #6366f1
  },
  purple: {
    primary: '236 72 153',    // #ec4899 (Pink 500)
    accent: '14 165 233',     // #0ea5e9 (Sky 500)
  },
  green: {
    primary: '34 197 94',     // #22c55e
    accent: '20 184 166',     // #14b8a6
  },
  orange: {
    primary: '249 115 22',    // #f97316
    accent: '245 158 11',     // #f59e0b
  },
  red: {
    primary: '239 68 68',     // #ef4444
    accent: '244 63 94',      // #f43f5e
  },
  cyan: {
    primary: '6 182 212',     // #06b6d4
    accent: '14 165 233',     // #0ea5e9
  },
}
