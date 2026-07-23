import { Icon, Icons } from '@/components/common'
import { cn } from '@/components/ui/cn'

interface ActivityItemProps {
  title: string
  subtitle?: string
  time: string
  icon: string
  iconBg?: string
  iconColor?: string
  className?: string
}

export function ActivityItem({
  title,
  subtitle,
  time,
  icon,
  iconBg = 'bg-primary-100 dark:bg-primary-900/40',
  iconColor = 'text-primary-600 dark:text-primary-400',
  className,
}: ActivityItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50',
        className,
      )}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconBg)}>
        <Icon icon={icon} className={cn('h-5 w-5', iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label text-secondary-900 dark:text-white">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-caption text-secondary-500 dark:text-secondary-400">{subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1 text-caption text-secondary-400">
        <Icon icon={Icons.clock} className="h-3 w-3" />
        {time}
      </div>
    </div>
  )
}
