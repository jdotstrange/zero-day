import { useMemo } from 'react'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function AreaChartsPage() {
  const { locale, t } = useLocale()

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, i, 1)))
  }, [locale])

  const revenue = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: t('charts.dataset.revenue'),
          data: [18500, 22400, 19800, 28200, 32100, 28800, 35200],
          fill: true,
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    }),
    [monthLabels, t],
  )

  const stackedAreas = useMemo(
    () => ({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: t('charts.dataset.subscriptions'),
          data: [12000, 15500, 17800, 21000],
          fill: true,
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: t('charts.dataset.one_time'),
          data: [6500, 6900, 7200, 8300],
          fill: true,
          borderColor: chartColors.green.solid,
          backgroundColor: chartColors.green.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    }),
    [t],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('charts.area_chart')}
        subtitle={t('charts.area.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={t('charts.area.single.title')}
          subtitle={t('charts.area.single.desc')}
        >
          <AreaChart data={revenue} height={320} />
        </ChartCard>

        <ChartCard
          title={t('charts.area.multi.title')}
          subtitle={t('charts.area.multi.desc')}
        >
          <AreaChart data={stackedAreas} height={320} />
        </ChartCard>
      </div>
    </div>
  )
}

export default AreaChartsPage
