import type { Locale } from '@/i18n'

export type LocaleOption = {
  locale: Locale
  label: string
  subLabel?: string
  flagSrc: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { locale: 'en', label: 'English', subLabel: '(USA)', flagSrc: '/assets/flags/usa.png' },
  { locale: 'fr', label: 'Français', subLabel: '(France)', flagSrc: '/assets/flags/france.png' },
  { locale: 'hi-IN', label: 'हिन्दी', subLabel: '(भारत)', flagSrc: '/assets/flags/india.png' },
  { locale: 'zh-CN', label: '中文', subLabel: '(中国)', flagSrc: '/assets/flags/china.png' },
  { locale: 'ja', label: '日本語', subLabel: '(日本)', flagSrc: '/assets/flags/japan.png' },
  { locale: 'ur', label: 'اردو', subLabel: '(پاکستان)', flagSrc: '/assets/flags/pakistan.png' },
  { locale: 'pt', label: 'Português', subLabel: '(Portugal)', flagSrc: '/assets/flags/portugal.png' },
  { locale: 'ru', label: 'Русский', subLabel: '(Россия)', flagSrc: '/assets/flags/russia.png' },
  { locale: 'es', label: 'Español', subLabel: '(España)', flagSrc: '/assets/flags/spain.png' },
  { locale: 'ar', label: 'العربية', subLabel: '(الإمارات)', flagSrc: '/assets/flags/uae.png' },
]

export function getLocaleOption(locale: Locale): LocaleOption {
  return LOCALE_OPTIONS.find((o) => o.locale === locale) ?? LOCALE_OPTIONS[0]
}
