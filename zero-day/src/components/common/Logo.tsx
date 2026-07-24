import { useLocale } from '@/i18n'
import { cn } from '@/components/ui/cn'

interface LogoProps {
  className?: string
  /** @deprecated Unused — mark size is driven by `height`. Kept so existing call sites type-check. */
  width?: number
  /** Mark size in px (text scales with this). */
  height?: number
  /** When true, show logomark + brand name. When false, mark only (e.g. mini sidebar). */
  showText?: boolean
  /** Use light text (auth dark panel, etc.). */
  onDark?: boolean
}

/**
 * Logo: placeholder logomark + live brand name from i18n (`brand.name`).
 * Bake / scaffold updates `brand.name` — no SVG wordmark with baked-in copy.
 */
export function Logo({
  className = '',
  height = 24,
  showText = true,
  onDark = false,
}: LogoProps) {
  const { t } = useLocale()
  const name = t('brand.name')
  const markSize = height

  const mark = (
    <img
      src="/assets/logo/logomark.svg"
      alt=""
      aria-hidden={showText}
      className="shrink-0"
      style={{ width: markSize, height: markSize }}
    />
  )

  if (!showText) {
    return (
      <img
        src="/assets/logo/logomark.svg"
        alt={name}
        className={className}
        style={{ width: markSize, height: markSize }}
      />
    )
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      role="img"
      aria-label={name}
    >
      {mark}
      <span
        className={cn(
          'truncate font-semibold tracking-tight',
          onDark ? 'text-white' : 'text-secondary-900 dark:text-white',
        )}
        style={{ fontSize: Math.max(14, Math.round(height * 0.72)) }}
      >
        {name}
      </span>
    </span>
  )
}
