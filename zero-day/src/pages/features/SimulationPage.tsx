import { Icon, Icons } from '@/components/common'
import { FeaturePageHeader } from '@/components/features'
import { Badge } from '@/components/ui'
import { useLocale } from '@/i18n'
import { SimulationDashboard } from '../../features/real-time-simulation'

export function SimulationPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.simulation}
        iconWrapClassName="bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400"
        title={t('features.simulation.title')}
        subtitle={t('features.simulation.subtitle')}
        badge={
          <Badge variant="success" className="gap-1">
            <Icon icon={Icons.circleFilled} className="h-1.5 w-1.5 animate-pulse" />
            {t('features.simulation.live')}
          </Badge>
        }
        actions={
          <>
            <Badge variant="neutral">{t('features.simulation.anomaly_detection')}</Badge>
            <Badge variant="neutral">{t('features.simulation.statistics')}</Badge>
          </>
        }
      />
      <SimulationDashboard />
    </div>
  )
}
