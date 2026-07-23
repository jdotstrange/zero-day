import { Icon, Icons } from '@/components/common'
import { FeaturePageHeader } from '@/components/features'
import { Badge } from '@/components/ui'
import { useLocale } from '@/i18n'
import { InsightsDashboard } from '../../features/smart-insights'

export function InsightsPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.insights}
        iconWrapClassName="bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400"
        title={t('features.insights.title')}
        subtitle={t('features.insights.subtitle')}
        badge={
          <Badge variant="primary" className="gap-1">
            <Icon icon={Icons.sparkles} className="h-3 w-3" />
            {t('features.insights.ai_analysis')}
          </Badge>
        }
        actions={
          <>
            <Badge variant="neutral">{t('features.insights.trend_detection')}</Badge>
            <Badge variant="neutral">{t('features.insights.anomaly_alerts')}</Badge>
          </>
        }
      />
      <InsightsDashboard />
    </div>
  )
}
