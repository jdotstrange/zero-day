import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'
import enMessages from './locales/en.json'
import frMessages from './locales/fr.json'
import hiINMessages from './locales/hi-IN.json'
import zhCNMessages from './locales/zh-CN.json'
import jaMessages from './locales/ja.json'
import urMessages from './locales/ur.json'
import ptMessages from './locales/pt.json'
import ruMessages from './locales/ru.json'
import esMessages from './locales/es.json'
import arMessages from './locales/ar.json'

export type Messages = Record<string, string>
export type Locale = 'en' | 'fr' | 'hi-IN' | 'zh-CN' | 'ja' | 'ur' | 'pt' | 'ru' | 'es' | 'ar'
export type TranslateVars = Record<string, string | number>

const STORAGE_KEY = 'zeroday-locale'
const DIRECTION_LOCK_STORAGE_KEY = 'zeroday-direction-locked-by-locale'
const DEFAULT_LOCALE: Locale = 'en'
const SUPPORTED_LOCALES: Locale[] = ['en', 'fr', 'hi-IN', 'zh-CN', 'ja', 'ur', 'pt', 'ru', 'es', 'ar']

const MESSAGES: Record<Locale, Messages> = {
  en: enMessages as Messages,
  fr: frMessages as Messages,
  'hi-IN': hiINMessages as Messages,
  'zh-CN': zhCNMessages as Messages,
  ja: jaMessages as Messages,
  ur: urMessages as Messages,
  pt: ptMessages as Messages,
  ru: ruMessages as Messages,
  es: esMessages as Messages,
  ar: arMessages as Messages,
}

const normalizeLocale = (value?: string | null): Locale => {
  if (!value) return DEFAULT_LOCALE
  return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  t: (key: string, vars?: TranslateVars) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { config: themeConfig, setDirection } = useTheme()

  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    const saved = localStorage.getItem(STORAGE_KEY)
    const normalized = normalizeLocale(saved)
    if (saved && normalized !== saved) {
      localStorage.removeItem(STORAGE_KEY)
    }
    return normalized
  })

  const messages = useMemo<Messages>(() => {
    // Allow locale packs to be partial overrides (missing keys fall back to English).
    const base = MESSAGES[DEFAULT_LOCALE]
    const override = MESSAGES[locale]
    if (!override || locale === DEFAULT_LOCALE) return base
    return { ...base, ...override }
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    const normalized = normalizeLocale(next)
    setLocaleState(normalized)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, normalized)
    }
  }, [])

  // Keep the document language attribute in sync (helps a11y and built-in browser behaviors).
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  // Auto-switch direction based on locale (Arabic/Urdu => RTL).
  useEffect(() => {
    // Only *lock* RTL for Arabic/Urdu. For all other locales, allow users
    // to choose direction manually from the Theme Customizer.
    const shouldRtl = locale === 'ar' || locale === 'ur'
    if (shouldRtl) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DIRECTION_LOCK_STORAGE_KEY, '1')
      }
      if (themeConfig.direction !== 'rtl') {
        setDirection('rtl')
      }
      return
    }

    // Leaving Arabic/Urdu: if RTL was forced by locale lock, restore LTR.
    if (typeof window !== 'undefined') {
      const wasLocked = localStorage.getItem(DIRECTION_LOCK_STORAGE_KEY) === '1'
      if (wasLocked) {
        localStorage.removeItem(DIRECTION_LOCK_STORAGE_KEY)
        if (themeConfig.direction !== 'ltr') {
          setDirection('ltr')
        }
      }
    }
  }, [locale, setDirection, themeConfig.direction])

  const t = useCallback(
    (key: string, vars?: TranslateVars) => {
      const template = messages[key] ?? MESSAGES[DEFAULT_LOCALE]?.[key] ?? key
      if (!vars) return template
      return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, rawName) => {
        const name = String(rawName).trim()
        const value = vars[name]
        return value === undefined ? match : String(value)
      })
    },
    [messages],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      messages,
      t,
    }),
    [locale, setLocale, messages, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
