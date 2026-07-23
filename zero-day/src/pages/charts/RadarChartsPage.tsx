import { useMemo } from 'react'
import { RadarChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function RadarChartsPage() {
  const { t } = useLocale()

  const data = useMemo(
    () => ({
      labels: [
        t('charts.radar.axis.design'),
        t('charts.radar.axis.performance'),
        t('charts.radar.axis.security'),
        t('charts.radar.axis.usability'),
        t('charts.radar.axis.support'),
        t('charts.radar.axis.features'),
      ],
      datasets: [
        {
          label: t('charts.radar.product_a'),
          data: [78, 82, 74, 88, 70, 85],
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          borderWidth: 2,
          pointRadius: 2,
        },
        {
          label: t('charts.radar.product_b'),
          data: [72, 76, 81, 79, 78, 73],
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          borderWidth: 2,
          pointRadius: 2,
        },
      ],
    }),
    [t],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('charts.radar.title')}
        subtitle={t('charts.radar.subtitle')}
      />

      <ChartCard
        title={t('charts.radar.comparison.title')}
        subtitle={t('charts.radar.comparison.desc')}
      >
        <RadarChart data={data} height={360} />
      </ChartCard>
    </div>
  )
}

export default RadarChartsPage
