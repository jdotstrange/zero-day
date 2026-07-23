import { useMemo, useRef, useState } from 'react'
import { useLocale, type Locale } from '@/i18n'

type Option = {
  locale: Locale
  label: string
  subLabel?: string
  flagSrc: string
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const options = useMemo<Option[]>(
    () => [
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
    ],
    [],
  )

  const active = options.find((o) => o.locale === locale) ?? options[0]

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!(e.currentTarget as HTMLDivElement).contains(e.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('language')}
      >
        <Flag src={active.flagSrc} alt={active.label} fallback={active.locale.toUpperCase()} className="w-6 h-6 rounded-full object-cover" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-xl py-2 px-1 z-[1035]"
          role="menu"
        >
          {options.map((o) => {
            const activeItem = o.locale === locale
            return (
              <button
                key={o.locale}
                type="button"
                className={
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ' +
                  (activeItem
                    ? 'bg-transparent text-theme-primary'
                    : 'text-secondary-700 dark:text-secondary-200 hover:bg-surface-50 dark:hover:bg-surface-800')
                }
                onClick={() => {
                  setLocale(o.locale)
                  setOpen(false)
                }}
                role="menuitem"
              >
                <Flag src={o.flagSrc} alt={o.label} fallback={o.locale.toUpperCase()} className="w-5 h-5 rounded-full object-cover shadow-sm" />
                <div className="flex items-center gap-1.5 flex-1">
                  <span className={`font-medium ${activeItem ? 'text-theme-primary' : ''}`}>
                    {o.label}
                  </span>
                  {o.subLabel && (
                     <span className="text-secondary-400 dark:text-secondary-500 font-normal">
                      {o.subLabel}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Flag({ src, alt, fallback, className }: { src: string; alt: string; fallback: string, className?: string }) {
  const [failed, setFailed] = useState(false)
  const classes = className || "w-6 h-6 rounded-md object-cover border border-surface-200 dark:border-surface-700";

  if (failed) {
    return (
      <span className={classes + " bg-surface-200 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200 text-ui-3xs flex items-center justify-center overflow-hidden"}>
        {fallback}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={classes}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
