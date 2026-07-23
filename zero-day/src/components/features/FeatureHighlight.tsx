import { Icon } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface FeatureHighlightItem {
  icon: string
  label: string
}

interface FeatureHighlightProps {
  title?: string
  description: string
  items: FeatureHighlightItem[]
}

export function FeatureHighlight({ title, description, items }: FeatureHighlightProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader className="pb-0">
          {title && <CardTitle className="text-body-sm">{title}</CardTitle>}
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
            {description}
          </p>
        </CardHeader>
      )}
      <CardContent className={title || description ? 'pt-4' : undefined}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-body-sm text-secondary-700 dark:text-secondary-300"
            >
              <Icon icon={item.icon} className="h-4 w-4 shrink-0 text-theme-primary" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
