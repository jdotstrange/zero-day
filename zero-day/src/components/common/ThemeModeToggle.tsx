import { Icon, Icons } from '@/components/common/Icon'
import { cn } from '@/components/ui/cn'
import { useTheme } from '@/hooks/useTheme'
import { useLocale } from '@/i18n'

/** Light/dark switch — intended for user menu / settings, not header chrome. */
export function ThemeModeToggle() {
  const { config, setMode } = useTheme()
  const { t } = useLocale()
  const isDark = config.mode === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`${t('theme.mode')}: ${isDark ? t('theme.dark') : t('theme.light')}`}
      title={isDark ? t('theme.light') : t('theme.dark')}
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border p-1 transition-colors',
        'border-surface-200 bg-surface-100 hover:bg-surface-50',
        'dark:border-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700',
      )}
    >
      <Icon
        icon={Icons.sun}
        className={cn(
          'pointer-events-none absolute left-2 h-4 w-4 transition-opacity',
          isDark ? 'text-secondary-400 opacity-40' : 'text-theme-primary opacity-100',
        )}
      />
      <Icon
        icon={Icons.moon}
        className={cn(
          'pointer-events-none absolute right-2 h-4 w-4 transition-opacity',
          isDark ? 'text-theme-primary opacity-100' : 'text-secondary-400 opacity-40',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-200',
          'dark:bg-surface-600',
          isDark ? 'translate-x-[1.85rem]' : 'translate-x-0',
        )}
      />
    </button>
  )
}
