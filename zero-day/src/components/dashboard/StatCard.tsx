import { Icon, Icons } from '@/components/common'
import { Card } from '@/components/ui'
import { cn } from '@/components/ui/cn'

interface StatCardProps {
  label: string
  value: string
  change?: string
  isPositive?: boolean
  icon: string
  iconBg?: string
  iconColor?: string
  showMenu?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-primary-100 dark:bg-primary-900/40',
  iconColor = 'text-primary-600 dark:text-primary-400',
  showMenu = true,
  className,
}: StatCardProps) {
  return (
    <Card padding="sm" className={cn('rounded-xl', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBg)}>
          <Icon icon={icon} className={cn('h-5 w-5', iconColor)} />
        </div>
        {showMenu && (
          <button
            type="button"
            className="rounded-lg p-1 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="More options"
          >
            <Icon icon={Icons.dotsVertical} className="h-4 w-4 text-secondary-400" />
          </button>
        )}
      </div>
      <p className="text-label text-secondary-500 dark:text-secondary-400">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="heading-3 text-secondary-900 dark:text-white">{value}</p>
        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold',
              isPositive
                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
            )}
          >
            {isPositive ? (
              <Icon icon={Icons.arrowUpRight} className="h-3 w-3" />
            ) : (
              <Icon icon={Icons.arrowDownRight} className="h-3 w-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </Card>
  )
}
