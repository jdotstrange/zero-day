import { type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

interface DashboardPageHeaderProps {
  title: string
  subtitle?: string
  badge?: ReactNode
  actions?: ReactNode
  className?: string
}

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  actions,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="heading-2 text-secondary-900 dark:text-white">{title}</h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">{actions}</div>
      )}
    </div>
  )
}
