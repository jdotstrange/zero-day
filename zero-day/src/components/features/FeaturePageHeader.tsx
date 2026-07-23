import { type ReactNode } from 'react'
import { Icon } from '@/components/common'
import { cn } from '@/components/ui/cn'

interface FeaturePageHeaderProps {
  icon: string
  iconClassName?: string
  iconWrapClassName?: string
  title: string
  subtitle?: string
  badge?: ReactNode
  actions?: ReactNode
  className?: string
}

export function FeaturePageHeader({
  icon,
  iconClassName,
  iconWrapClassName = 'bg-theme-primary/10 text-theme-primary',
  title,
  subtitle,
  badge,
  actions,
  className,
}: FeaturePageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            iconWrapClassName,
          )}
        >
          <Icon icon={icon} className={cn('h-5 w-5', iconClassName)} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="heading-2 text-secondary-900 dark:text-white">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  )
}
