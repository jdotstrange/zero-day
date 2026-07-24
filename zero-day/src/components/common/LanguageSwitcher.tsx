import { useState } from 'react'
import { useLocale } from '@/i18n'
import { LOCALE_OPTIONS, getLocaleOption } from '@/i18n/localeOptions'
import { cn } from '@/components/ui/cn'

type LanguageSwitcherProps = {
  /** icon = compact flag (legacy); menu = nested list for user dropdown; panel = settings list */
  variant?: 'icon' | 'menu' | 'panel'
  className?: string
  onSelect?: () => void
}

export function LanguageSwitcher({
  variant = 'icon',
  className,
  onSelect,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const active = getLocaleOption(locale)

  if (variant === 'panel') {
    return (
      <div className={cn('space-y-2', className)} role="listbox" aria-label={t('language')}>
        {LOCALE_OPTIONS.map((o) => {
          const activeItem = o.locale === locale
          return (
            <button
              key={o.locale}
              type="button"
              role="option"
              aria-selected={activeItem}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                activeItem
                  ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                  : 'border-surface-200 text-secondary-700 hover:bg-surface-50 dark:border-surface-700 dark:text-secondary-200 dark:hover:bg-surface-800',
              )}
              onClick={() => {
                setLocale(o.locale)
                onSelect?.()
              }}
            >
              <Flag
                src={o.flagSrc}
                alt={o.label}
                fallback={o.locale.toUpperCase()}
                className="h-5 w-5 rounded-full object-cover shadow-sm"
              />
              <span className="font-medium">{o.label}</span>
              {o.subLabel && (
                <span className="text-secondary-400 dark:text-secondary-500">{o.subLabel}</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'menu') {
    return (
      <div className={cn('max-h-64 space-y-0.5 overflow-y-auto', className)} role="menu">
        {LOCALE_OPTIONS.map((o) => {
          const activeItem = o.locale === locale
          return (
            <button
              key={o.locale}
              type="button"
              role="menuitemradio"
              aria-checked={activeItem}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors',
                activeItem
                  ? 'text-theme-primary'
                  : 'text-secondary-700 hover:bg-surface-50 dark:text-secondary-200 dark:hover:bg-surface-800',
              )}
              onClick={() => {
                setLocale(o.locale)
                onSelect?.()
              }}
            >
              <Flag
                src={o.flagSrc}
                alt={o.label}
                fallback={o.locale.toUpperCase()}
                className="h-5 w-5 rounded-full object-cover shadow-sm"
              />
              <span className={cn('font-medium', activeItem && 'text-theme-primary')}>{o.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn('relative', className)}
      onBlur={(e) => {
        if (!(e.currentTarget as HTMLDivElement).contains(e.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('language')}
      >
        <Flag
          src={active.flagSrc}
          alt={active.label}
          fallback={active.locale.toUpperCase()}
          className="h-6 w-6 rounded-full object-cover"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-[1035] mt-2 w-56 rounded-2xl border border-surface-200 bg-white px-1 py-2 shadow-xl dark:border-surface-700 dark:bg-surface-900"
          role="menu"
        >
          <LanguageSwitcher
            variant="menu"
            onSelect={() => {
              setOpen(false)
              onSelect?.()
            }}
          />
        </div>
      )}
    </div>
  )
}

function Flag({
  src,
  alt,
  fallback,
  className,
}: {
  src: string
  alt: string
  fallback: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const classes =
    className ||
    'h-6 w-6 rounded-md object-cover border border-surface-200 dark:border-surface-700'

  if (failed) {
    return (
      <span
        className={
          classes +
          ' flex items-center justify-center overflow-hidden bg-surface-200 text-ui-3xs text-secondary-700 dark:bg-surface-800 dark:text-secondary-200'
        }
      >
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
