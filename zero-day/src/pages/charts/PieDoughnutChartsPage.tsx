import { useMemo } from 'react'
import { DoughnutChart, PieChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function PieDoughnutChartsPage() {
  const { t } = useLocale()

  const pie = useMemo(
    () => ({
      labels: [t('charts.source.organic'), t('charts.source.paid'), t('charts.source.referral'), t('charts.source.email')],
      datasets: [
        {
          data: [42, 28, 18, 12],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.purple.solid,
            chartColors.green.solid,
            chartColors.orange.solid,
          ],
          borderWidth: 0,
        },
      ],
    }),
    [t],
  )

  const doughnut = useMemo(
    () => ({
      labels: ['Chrome', 'Safari', 'Firefox', 'Edge'],
      datasets: [
        {
          data: [58, 19, 14, 9],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.cyan.solid,
            chartColors.orange.solid,
            chartColors.purple.solid,
          ],
          borderWidth: 0,
        },
      ],
    }),
    [],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('charts.pie_doughnut.title')}
        subtitle={t('charts.pie_doughnut.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={t('charts.pie.title')}
          subtitle={t('charts.pie.desc')}
        >
          <PieChart data={pie} height={300} />
        </ChartCard>

        <ChartCard
          title={t('charts.doughnut.title')}
          subtitle={t('charts.doughnut.desc')}
        >
          <DoughnutChart data={doughnut} height={300} centerText="58%" centerSubtext="Chrome" />
        </ChartCard>
      </div>
    </div>
  )
}

export default PieDoughnutChartsPage
