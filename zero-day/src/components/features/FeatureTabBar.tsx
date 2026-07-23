import { Icon } from '@/components/common'
import { Button, Card } from '@/components/ui'

export interface FeatureTab<T extends string = string> {
  id: T
  label: string
  icon?: string
}

interface FeatureTabBarProps<T extends string> {
  tabs: FeatureTab<T>[]
  active: T
  onChange: (id: T) => void
}

export function FeatureTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: FeatureTabBarProps<T>) {
  return (
    <Card className="p-1.5">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={active === tab.id ? 'primary' : 'ghost'}
            className="min-w-0 flex-1"
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <Icon icon={tab.icon} />}
            <span className="truncate">{tab.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}
